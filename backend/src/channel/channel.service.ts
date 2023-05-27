import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma.service';
import { Channel, Prisma } from '@prisma/client';


@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}
  
  async create(createChannelDto: CreateChannelDto) {
    var createData;
    try {
      const {chName, intraId, chPwd} = createChannelDto;
      createData = await this.prisma.channel.create({
        data: { chName, chUserCnt: 0, intraId, chPwd },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('chName')) {
        throw new ConflictException('Duplicate chName');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    return createData;
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    var updateData;
    try {
      const {chName, intraId, chPwd} = updateChannelDto;
      updateData = await this.prisma.channel.update({ 
        where: { chIdx: id }, 
        data: {chName, intraId, chPwd} 
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

  async delete(id: number) {
    var deleteData;
    try {
      deleteData = await this.prisma.channel.delete({ where: { chIdx: id} });
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

  async findOneById(id: number) {
    var findData;
    try {
      findData = await this.prisma.channel.findUnique({ 
        where: { chIdx: id } });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    if (findData == null)
        throw new NotFoundException('channel not found');
    return findData;
  }

  async getChannelName(id: number) {
    var findData;
    try {
      findData = await this.prisma.channel.findUnique({ 
        where: { chIdx: id },
        select: { chName: true }
      });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    if (findData == null)
        throw new NotFoundException('channel not found');
    return findData;
  }

  async getChannelUserCnt(id: number) {
    var findData;
    try {
      findData = await this.prisma.channel.findUnique({ 
        where: { chIdx: id },
        select: { chUserCnt: true }
      });
    } catch (error) {
      if (error.code === 'P2016' || error.code === 'P2025') {
        throw new NotFoundException('channel not found');
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
    if (findData == null)
        throw new NotFoundException('channel not found');
    return findData;
  }

  async checkPwd(pwd: string) {

  }

  async enter(id: number, intraId: string) {
    // pwd 검사
    return this.prisma.channel.update({ where: { chIdx: id }, data: { intraId: intraId }});
  }

  // async leave(id: number, intraId: string) {
  //   return this.prisma.channel.delete({ where: { chIdx: id }, data: { intraId: null }});
  // }
  
}
