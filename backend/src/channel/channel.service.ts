import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma.service';
import { Channel, Prisma } from '@prisma/client';
import { MemberIdDto } from './dto/member-id.dto';
import { memoryUsage } from 'process';

@Injectable()
export class ChannelService {
  private channelMember: Record<number, string[]>;

  constructor(private prisma: PrismaService) {
    this.channelMember = {};
  }

  async create(createChannelDto: CreateChannelDto) {
    var createData;
    try {
      const { chName, operatorId } = createChannelDto;
      createData = await this.prisma.channel.create({
        data: { chName, chUserCnt: 1, 
          operator: { connect: { intraId: operatorId }, } },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('chName')) {
        throw new ConflictException('Duplicate chName');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    return createData;
  }

  async update(idx: number, updateChannelDto: UpdateChannelDto) {
    var updateData;
    try {
      const { chName, operatorId, chPwd } = updateChannelDto;
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
        where: { chIdx: id },
      });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    if (findData == null) throw new NotFoundException('channel not found');
    if (findData == null) throw new NotFoundException('channel not found');
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
    if (findData == null) throw new NotFoundException('channel not found');
    return findData;
  }

  // async checkPwd(pwd: string) {}

  async enter(idx: number, memberIdDto: MemberIdDto) {
    // pwd 검사
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
      if (!(idx in this.channelMember)) {
        this.channelMember[idx] = [];
      }
      this.channelMember[idx].push(memberId);
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
    return updatedChannel;
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
      this.channelMember[idx] = this.channelMember[idx].filter(item => item !== memberId);

    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
    return updatedChannel;
  }

  async getChannelUsers(idx: number) {
    var findData;
    try {
      findData = this.findOneById(idx);
      if (findData == null) throw new NotFoundException('channel not found');
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
    console.log("get user");
    console.log(this.channelMember[idx]);
    return this.channelMember[idx];
  }

}
