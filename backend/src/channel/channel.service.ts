import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ChannelUserDto } from './dto/channel-user.dto';
import { MessageDto } from './dto/message.dto';
import * as bcrypt from 'bcrypt';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';

// mute 5분........ 

@Injectable()
export class ChannelService {
  private channelUsers: Record<number, { intraId: string, nickName: string }[]>;
  private banUsers: Record<number, { intraId: string, nickName: string }[] >;
  private messageList: Record<number, { nickName: string, message: string }[]>;
  private mutedUsers: Record<number, { intraId: string, timeoutId: NodeJS.Timeout }[]>;

  constructor(private prisma: PrismaService) {
    this.channelUsers = {};
    this.banUsers = {};
    this.messageList = {};
    this.mutedUsers = {};
  }

  async hashPassword(channel: CreateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
    return channel;
  }

  async create(member: MemberInfoDto, createChannelDto: CreateChannelDto) {
    try {
      if (createChannelDto.chPwd !== undefined)
      {
        createChannelDto = await this.hashPassword(createChannelDto);
      }
      const { chName, chPwd, isDM } = createChannelDto;
      const createData = await this.prisma.channel.create({
        data: { chName, chUserCnt: 1, chPwd, isDM: isDM === undefined ? false : isDM,
          operator: { connect: { intraId: member.intraId }, } },
      });

      this.channelUsers[createData.chIdx] = [{intraId: member.intraId, nickName: member.nickName}];
      this.banUsers[createData.chIdx] = [];
      this.messageList[createData.chIdx] = [];
      this.mutedUsers[createData.chIdx] = [];
      return createData;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002' && error.meta?.target?.includes('chName')) {
        throw new ConflictException('Duplicate chName');
      }
      else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`intraId does not exist.`);
      }
      else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Check request form');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async hashPasswordModify(channel: UpdateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
  }

  async update(idx: number, updateChannelDto: UpdateChannelDto) {
    try {
      const { chName, chPwd, operatorId } = updateChannelDto;
      if (chPwd !== undefined)
      {
        await this.hashPasswordModify(updateChannelDto);
        console.log(updateChannelDto.chPwd);
      }
      const updateData = await this.prisma.channel.update({
        where: { chIdx: idx },
        data: { chName, chPwd, operatorId },
      });
      return updateData;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('chName')) {
        throw new ConflictException('Duplicate chName');
      }
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(idx: number) {
    try {
      const deleteData = await this.prisma.channel.delete({ where: { chIdx: idx } });
      this.channelUsers[idx] = [];
      this.banUsers[idx] = [];
      this.messageList[idx] = [];
      this.mutedUsers[idx] = [];
      return deleteData;
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findChannelAll() {
    return await this.prisma.channel.findMany({ where: { isDM: false }});
  }
  
  async findDMAll() {
    return await this.prisma.channel.findMany({ where: { isDM: true }});
  }

  async findOneById(idx: number) {
    try {
      const findData = await this.prisma.channel.findUnique({
        where: { chIdx: idx },
      });
      if (findData === null) throw new NotFoundException('channel not found');
      return findData;
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025' || error.status === 404) {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findOneByName(name: string) {
    try {
      const findData = await this.prisma.channel.findUnique({
        where: { chName: name },
      });
      if (findData === null) throw new NotFoundException('channel not found');
      return findData;
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025' || error.status === 404) {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannelName(idx: number) {
    try {
      const findData = await this.prisma.channel.findUnique({
        where: { chIdx: idx },
        select: { chName: true },
      });
      if (findData === null) throw new NotFoundException('channel not found');
      return findData;
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025' || error.status === 404) {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannelUserCnt(idx: number) {
    try {
      const findData = await this.prisma.channel.findUnique({
        where: { chIdx: idx },
        select: { chUserCnt: true },
      });
      if (findData == null) throw new NotFoundException('channel not found');
      return findData;
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async checkPassword(idx: number, updateChannelDto: UpdateChannelDto) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      const isMatch = await bcrypt.compare(updateChannelDto.chPwd, channel.chPwd);
      return isMatch;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  
  async isOperator(idx: number, intraId: string) {
    try {
      const channel = await this.findOneById(idx);
      const { operatorId } = channel;
      if (!channel)
        throw new NotFoundException('channel not found');
      if (operatorId === intraId)
        return true;
      return false;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async isDM(idx: number) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      const { isDM } = channel;
      if (isDM === true)
        return true;
      return false;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // channel users

  async enter(idx: number, member: MemberInfoDto) {
    try {
      const { intraId, nickName } = member;
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');

      // user check
      if (this.channelUsers[idx].find(user => user.intraId === member.intraId))
        return ;
      // ban check
      this.banUsers[idx].map((data) => {
        if (data.intraId === member.intraId) {
          throw new ForbiddenException('banned user');
        }
      })
      if (channel.chUserCnt >= 5)
        throw new ForbiddenException('max capacity');
      const updatedChannel = await this.prisma.channel.update({
        where: { chIdx: idx},
        data: {
          chUserCnt: { increment: 1},
        }
      });
      this.channelUsers[idx].push({ intraId, nickName });
    } catch (error) {
      console.log(error);
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // oper 가 나갔을때 다음사람 물려줌
  // 아무도 없으면 채널 삭제
  async leave(idx: number, memberId: string) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      const updatedChannel = await this.prisma.channel.update({
        where: { chIdx: idx},
        data: {
          chUserCnt: { decrement: 1},
        }
      });
      this.channelUsers[idx] = this.channelUsers[idx].filter(item => item.intraId !== memberId);
      if (updatedChannel.chUserCnt == 0)
        this.delete(idx);
      else if (memberId === updatedChannel.operatorId)
        this.update(idx, {operatorId: this.channelUsers[idx][0].intraId});
    } catch (error) {
      console.log(error);
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async kick(idx: number, memberDto: ChannelUserDto)
  {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      const updatedChannel = await this.prisma.channel.update({
        where: { chIdx: idx},
        data: {
          chUserCnt: { decrement: 1},
        }
      });
      this.channelUsers[idx] = this.channelUsers[idx].filter(item => item.intraId !== memberDto.intraId);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannelUsers(idx: number) {
    try {
      const findData = await this.findOneById(idx);
      if (findData == null) throw new NotFoundException('channel not found');
      return this.channelUsers[idx];
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannels(intraId: string) {
    let channels = [];
    try {
      const allChannel = await this.findChannelAll();
      console.log("get all Channel");
      const chIdxList = allChannel.map((channel) => channel.chIdx);
      console.log(chIdxList);
      for (const idx of chIdxList) {
        const channel = await this.findOneById(idx);
        const users = this.channelUsers[idx];
        for (const data of users) {
          if (data.intraId === intraId) {
            channels.push(channel);
          }
        }
      }
      console.log(channels);
      return channels;
    } catch (error) {
      console.log(error);
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getDMChannels(intraId: string) {
    let channels = [];
    try {
      const allChannel = await this.findDMAll();
      console.log("get all DMChannel");
      const chIdxList = allChannel.map((channel) => channel.chIdx);
      for (const idx of chIdxList) {
        const channel = await this.findOneById(idx);
        const users = this.channelUsers[idx];
        for (const data of users) {
          if (data.intraId === intraId) {
            channels.push(channel);
          }
        }
      }
      return channels;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // ban id 랑 nick 둘다 넘겨줘야함
  async saveBanUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId, nickName } = channelUserDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      this.banUsers[idx].push({intraId, nickName});
      console.log(this.banUsers[idx]);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteBanUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId } = channelUserDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      this.banUsers[idx] = this.banUsers[idx].filter(item => item.intraId !== intraId);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannelBanUsers(idx: number) {
    try {
      const findData = await this.findOneById(idx);
      if (findData == null) throw new NotFoundException('channel not found');
      return this.banUsers[idx];
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // message

  async sendMessage(chanName: string, nickName: string, message: string) {
    try {
      const channel = await this.findOneByName(chanName);
      if (!channel)
        throw new NotFoundException('channel not found');
      this.messageList[channel.chIdx].push({ nickName, message });
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  
  // ban user 면 리스트 안가져오는거 확인
  async getMessageList(idx: number, intraId: string) {
    try {
      if (this.banUsers[idx].find(user => user.intraId === intraId))
        return ;
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      return this.messageList[idx];
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  // mute
  async muteUser(idx: number, intraId: string) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');

      const foundUser = this.mutedUsers[idx].find(id => id.intraId === intraId);
      if (foundUser) {
        clearTimeout(foundUser.timeoutId);
        this.mutedUsers[idx] = this.mutedUsers[idx].filter(id => id.intraId !== intraId);
      }

      const timeoutId = setTimeout(() => {
        this.unmuteUser(idx, intraId);
      }, 1 * 60 * 1000);
      this.mutedUsers[idx].push({ intraId, timeoutId });
      console.log("mute");
      console.log(this.mutedUsers[idx]);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async unmuteUser(idx: number, intraId: string) {
    if (this.mutedUsers[idx].find(id => id.intraId === intraId))
    {
      this.mutedUsers[idx] = this.mutedUsers[idx].filter(id => id.intraId !== intraId);
      console.log("unmute");
    }
  }

  async ismuted(idx: number, intraId: string) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      if (this.mutedUsers[idx].find(id => id.intraId === intraId))
        return true;
      return false;
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
