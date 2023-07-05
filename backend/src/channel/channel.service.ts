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
import { PrismaService } from 'src/prisma.service';
import { Member, Prisma } from '@prisma/client';
import { MemberIdDto } from './dto/member-id.dto';
import { MessageDto } from './dto/message.dto';
import * as bcrypt from 'bcrypt';


// channel user 가져오기에 operator 도
// get my channel intraid 까서 가져오기
// nickname intraid 저장
// channel interid, nickname 다 반환
@Injectable()
export class ChannelService {
  private channelUsers: Record<number, string[]>;
  private banUsers: Record<number, string[] >;
  private messageList: Record<number, { memberId: string, message: string }[]>;

  constructor(private prisma: PrismaService) {
    this.channelUsers = {};
    this.banUsers = {};
    this.messageList = {};
  }

  async hashPassword(channel: CreateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
    return channel;
  }

  async create(operatorId: string, createChannelDto: CreateChannelDto) {
    try {
      if (createChannelDto.chPwd !== undefined)
      {
        createChannelDto = await this.hashPassword(createChannelDto);
      }
      const { chName, chPwd, isDM } = createChannelDto;
      const createData = await this.prisma.channel.create({
        data: { chName, chUserCnt: 1, chPwd, isDM: isDM === undefined ? false : isDM,
          operator: { connect: { intraId: operatorId }, } },
      });
      this.channelUsers[createData.chIdx] = [];
      this.banUsers[createData.chIdx] = [];
      this.messageList[createData.chIdx] = [];
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
      const { chName, chPwd } = updateChannelDto;
      if (chPwd !== undefined)
      {
        await this.hashPasswordModify(updateChannelDto);
        console.log(updateChannelDto.chPwd);
      }
      const updateData = await this.prisma.channel.update({
        where: { chIdx: idx },
        data: { chName, chPwd },
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
  
  async isOperator(idx: number, memberIdDto: MemberIdDto) {
    try {
      const channel = await this.findOneById(idx);
      const { operatorId } = channel;
      if (!channel)
        throw new NotFoundException('channel not found');
      if (operatorId === memberIdDto.memberId)
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
      const { isDM } = channel;
      if (!channel)
        throw new NotFoundException('channel not found');
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

  async enter(idx: number, memberIdDto: MemberIdDto) {
    const { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');

      this.banUsers[idx].map((id) => {
        if (id === memberId) {
          throw new ForbiddenException('banned user');
        }
      })
      const updatedChannel = await this.prisma.channel.update({
        where: { chIdx: idx},
        data: {
          chUserCnt: { increment: 1},
        }
      });
      this.channelUsers[idx].push(memberId);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async leave(idx: number, memberIdDto: MemberIdDto) {
    const { memberId } = memberIdDto;
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
      this.channelUsers[idx] = this.channelUsers[idx].filter(item => item !== memberId);

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
    console.log(intraId);
    var channels = [];
    // const channels = [];
    try {
      const allChannel = await this.findChannelAll();
      const chIdxList = allChannel.map((channel) => channel.chIdx);
      for (const idx of chIdxList) {
        console.log(idx);
        const channel = await this.findOneById(idx);
        const { operatorId } = channel;
        if (operatorId === intraId)
          channels.push(channel);
        const users = this.channelUsers[idx];
        console.log(users);
        for (const id of users) {
          console.log(channel);
          if (id === intraId) {
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
    var channels = [];
    try {
      const allChannel = await this.findDMAll();
      console.log("get all DMChannel");
      const chIdxList = allChannel.map((channel) => channel.chIdx);
      for (const idx of chIdxList) {
        const channel = await this.findOneById(idx);
        const { operatorId } = channel;
        if (operatorId === intraId)
          channels.push(channel);
        const users = this.channelUsers[idx];
        for (const id of users) {

          if (id === intraId) {
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

  // ban

  async saveBanUser(idx: number, memberIdDto: MemberIdDto) {
    const { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');

      this.banUsers[idx].push(memberId);
      console.log(this.banUsers);
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteBanUser(idx: number, memberIdDto: MemberIdDto) {
    const { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      this.banUsers[idx] = this.banUsers[idx].filter(item => item !== memberId);
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

  async sendMessage(idx: number, messageDto: MessageDto) {
    try {
      const { memberId, message } = messageDto;
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      this.messageList[idx].push({memberId, message});
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException('channel not found');
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  
  async getMessageList(idx: number) {
    try {
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

}
