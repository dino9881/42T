import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { MemberIdDto } from './dto/member-id.dto';
import { MessageDto } from './dto/message.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  private channelUsers: Record<number, string[]>;
  private banUsers: Record<number, string[] >;
  // private messageList: Record<number,  Record<string, string>>;
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

  async create(createChannelDto: CreateChannelDto) {
    var createData;
    try {
      
      if (createChannelDto.chPwd !== undefined)
      {
        createChannelDto = await this.hashPassword(createChannelDto);
        console.log(createChannelDto.chPwd);
      }
      const { chName, chPwd, operatorId } = createChannelDto;
      console.log(createChannelDto.chPwd);

      createData = await this.prisma.channel.create({
        data: { chName, chUserCnt: 1, chPwd,
          operator: { connect: { intraId: operatorId }, } },
      });

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
    return createData;
  }

  async hashPasswordModify(channel: UpdateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
  }

  async update(idx: number, updateChannelDto: UpdateChannelDto) {
    var updateData;
    try {
      const { chName, operatorId, chPwd } = updateChannelDto;
      if (chPwd !== undefined)
      {
        await this.hashPasswordModify(updateChannelDto);
        console.log(updateChannelDto.chPwd);
      }
      updateData = await this.prisma.channel.update({
        where: { chIdx: idx },
        data: { chName, operatorId, chPwd },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('chName')) {
        throw new ConflictException('Duplicate chName');
      }
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    return updateData;
  }

  async delete(idx: number) {
    var deleteData;
    try {
      deleteData = await this.prisma.channel.delete({ where: { chIdx: idx } });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    return deleteData;
  }

  async findAll() {
    return this.prisma.channel.findMany();
  }

  async findOneById(idx: number) {
    var findData;
    try {
      findData = await this.prisma.channel.findUnique({
        where: { chIdx: idx },
      });
    } catch (error) {
      if (findData == null) throw new NotFoundException('channel not found');
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    return findData;
  }

  async getChannelName(idx: number) {
    var findData;
    try {
      findData = await this.prisma.channel.findUnique({
        where: { chIdx: idx },
        select: { chName: true },
      });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    if (findData == null) throw new NotFoundException('channel not found');
    return findData;
  }

  async getChannelUserCnt(idx: number) {
    var findData;
    try {
      findData = await this.prisma.channel.findUnique({
        where: { chIdx: idx },
        select: { chUserCnt: true },
      });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    if (findData == null) throw new NotFoundException('channel not found');
    return findData;
  }

  async checkPassword(idx: number, updateChannelDto: UpdateChannelDto) {
    var isMatch;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
      isMatch = await bcrypt.compare(updateChannelDto.chPwd, channel.chPwd);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
    return isMatch;
  }
  
  // channel users

  async enter(idx: number, memberIdDto: MemberIdDto) {
    var updatedChannel;
    var { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
      updatedChannel = await this.prisma.channel.update({
        where: { chIdx: idx},
        data: {
          chUserCnt: { increment: 1},
        }
      });
      if (!(idx in this.channelUsers)) {
        this.channelUsers[idx] = [];
      }
      this.channelUsers[idx].push(memberId);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async leave(idx: number, memberIdDto: MemberIdDto) {
    var updatedChannel;
    var { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
      updatedChannel = await this.prisma.channel.update({
        where: { chIdx: idx},
        data: {
          chUserCnt: { decrement: 1},
        }
      });
      this.channelUsers[idx] = this.channelUsers[idx].filter(item => item !== memberId);

    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannelUsers(idx: number) {
    var findData;
    try {
      findData = this.findOneById(idx);
      if (findData == null) throw new NotFoundException('channel not found');
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
    console.log("get users");
    console.log(this.channelUsers[idx]);
    return this.channelUsers[idx];
  }

  // ban

  async saveBanUser(idx: number, memberIdDto: MemberIdDto) {
    var { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
      if (!(idx in this.banUsers)) {
        this.banUsers[idx] = [];
      }
      this.banUsers[idx].push(memberId);
      console.log(this.banUsers);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteBanUser(idx: number, memberIdDto: MemberIdDto) {
    var { memberId } = memberIdDto;
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
      this.banUsers[idx] = this.banUsers[idx].filter(item => item !== memberId);

    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async getChannelBanUsers(idx: number) {
    var findData;
    try {
      findData = this.findOneById(idx);
      if (findData == null) throw new NotFoundException('channel not found');
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
    console.log("get ban users");
    console.log(this.banUsers[idx]);
    return this.banUsers[idx];
  }

  // message
  async sendMessage(idx: number, messageDto: MessageDto) {
    try {
      const { memberId, message } = messageDto;
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
        if (!(idx in this.messageList)) {
          this.messageList[idx] = [];
        }
        this.messageList[idx].push({memberId, message});
        console.log(this.messageList[idx]);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  
  // 채널 들어갈때 한번 호출 후에 메세지를 뽑고 한번 비울까
  // 여러번 받아올 거면 리셋 만들기
  async getMessageList(idx: number) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
        if (!(idx in this.messageList)) {
          this.messageList[idx] = [];
        }
        console.log(this.messageList[idx]);
        return this.messageList[idx];
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async deleteMessageList(idx: number) {
    try {
      const channel = await this.findOneById(idx);
      if (!channel)
        throw new NotFoundException('channel not found');
    
        if (idx in this.messageList) {
          this.messageList[idx] = [];
        }
        console.log(this.messageList[idx]);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}

// 개인 채널 구분..?