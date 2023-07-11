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
import * as bcrypt from 'bcrypt';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';

// 전체 exception 확인

@Injectable()
export class ChannelService {
  private channelUsers: Record<number, { intraId: string; nickName: string }[]>;
  private banUsers: Record<number, { intraId: string; nickName: string }[]>;
  private messageList: Record<number, { nickName: string; message: string }[]>;
  private mutedUsers: Record<
    number,
    { intraId: string; nickName: string; timeoutId: NodeJS.Timeout }[]
  >;

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
      if (createChannelDto.chPwd !== undefined) {
        createChannelDto = await this.hashPassword(createChannelDto);
      }
      const { chName, chPwd, isDM } = createChannelDto;
      const createData = await this.prisma.channel.create({
        data: {
          chName,
          chUserCnt: 1,
          chPwd,
          isDM: isDM === undefined ? false : isDM,
          operator: { connect: { intraId: member.intraId } },
        },
      });

      this.channelUsers[createData.chIdx] = [
        { intraId: member.intraId, nickName: member.nickName },
      ];
      this.banUsers[createData.chIdx] = [];
      this.messageList[createData.chIdx] = [];
      this.mutedUsers[createData.chIdx] = [];

      return createData;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002' && error.meta?.target?.includes('chName')) {
        throw new ConflictException('Duplicate chName');
      } else if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`intraId does not exist.`);
      } else if (error instanceof Prisma.PrismaClientValidationError) {
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
    const { chPwd, operatorId } = updateChannelDto;
    if (chPwd !== undefined) {
      await this.hashPasswordModify(updateChannelDto);
      console.log(updateChannelDto.chPwd);
    }

    const updateData = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: { chPwd, operatorId },
    });
    if (updateData === null) throw new NotFoundException('channel not found');
    return updateData;
  }

  async findOneById(idx: number) {
    const findData = await this.prisma.channel.findUnique({
      where: { chIdx: idx },
    });
    if (findData === null) throw new NotFoundException('channel not found');
    return findData;
  }

  async delete(idx: number) {
    await this.findOneById(idx);
    await this.prisma.channel.delete({ where: { chIdx: idx } });
    this.channelUsers[idx] = [];
    this.banUsers[idx] = [];
    this.messageList[idx] = [];
    this.mutedUsers[idx] = [];
  }

  async findChannelAll() {
    return await this.prisma.channel.findMany({ where: { isDM: false } });
  }

  async findDMAll() {
    return await this.prisma.channel.findMany({ where: { isDM: true } });
  }

  async findOneByName(name: string) {
    const findData = await this.prisma.channel.findUnique({
      where: { chName: name },
    });
    if (findData === null) throw new NotFoundException('channel not found');
    return findData;
  }

  async getChannelName(idx: number) {
    const findData = await this.prisma.channel.findUnique({
      where: { chIdx: idx },
      select: { chName: true },
    });
    if (findData === null) throw new NotFoundException('channel not found');
    return findData;
  }

  async getChannelUserCnt(idx: number) {
    const findData = await this.prisma.channel.findUnique({
      where: { chIdx: idx },
      select: { chUserCnt: true },
    });
    if (findData == null) throw new NotFoundException('channel not found');
    return findData;
  }

  async checkPassword(idx: number, updateChannelDto: UpdateChannelDto) {
    const channel = await this.findOneById(idx);
    const isMatch = await bcrypt.compare(updateChannelDto.chPwd, channel.chPwd);
    return isMatch;
  }

  async isOperator(idx: number, intraId: string) {
    const channel = await this.findOneById(idx);
    const { operatorId } = channel;
    if (operatorId === intraId) return true;
    return false;
  }

  async isDM(idx: number) {
    const channel = await this.findOneById(idx);
    const { isDM } = channel;
    if (isDM === true) return true;
    return false;
  }

  // channel users

  async enter(idx: number, member: MemberInfoDto) {
    const { intraId, nickName } = member;
    const channel = await this.findOneById(idx);

    // user check
    if (this.channelUsers[idx].find((user) => user.intraId === member.intraId))
      return;
    // ban check
    this.banUsers[idx].map((data) => {
      if (data.intraId === member.intraId) {
        throw new ForbiddenException('banned user');
      }
    });
    // max check
    if (channel.chUserCnt >= 5) throw new ForbiddenException('max capacity');

    const updatedChannel = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: {
        chUserCnt: { increment: 1 },
      },
    });
    this.channelUsers[idx].push({ intraId, nickName });
  }

  async leave(idx: number, memberId: string) {
    await this.findOneById(idx);
    const updatedChannel = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: {
        chUserCnt: { decrement: 1 },
      },
    });
    this.channelUsers[idx] = this.channelUsers[idx].filter(
      (item) => item.intraId !== memberId,
    );
    // 아무도 안 남을 경우 채널 삭제
    if (updatedChannel.chUserCnt <= 0) this.delete(idx);
    // oper 가 나갔을 때 다음 사람 oper 설정
    else if (memberId === updatedChannel.operatorId)
      this.update(idx, { operatorId: this.channelUsers[idx][0].intraId });
  }

  async kick(idx: number, memberDto: ChannelUserDto) {
    await this.findOneById(idx);
    const updatedChannel = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: {
        chUserCnt: { decrement: 1 },
      },
    });
    this.channelUsers[idx] = this.channelUsers[idx].filter(
      (item) => item.intraId !== memberDto.intraId,
    );
  }

  async getChannelUsers(idx: number) {
    await this.findOneById(idx);
    return this.channelUsers[idx];
  }

  async isChanUsers(chanName: string, nickName: string) {
    const channel = await this.findOneByName(chanName);
    const users = this.channelUsers[channel.chIdx];
    if (users.find((user) => user.nickName === nickName)) return true;
    return false;
  }

  async getChannels(intraId: string) {
    let channels = [];
    const allChannel = await this.findChannelAll();
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
  }

  async getDMChannels(intraId: string) {
    let channels = [];
    const allChannel = await this.findDMAll();
    console.log('get all DMChannel');
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
  }

  // ban id 랑 nick 둘다 넘겨줘야함
  async saveBanUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId, nickName } = channelUserDto;
    await this.findOneById(idx);
    this.banUsers[idx].push({ intraId, nickName });
  }

  async deleteBanUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId } = channelUserDto;
    await this.findOneById(idx);
    this.banUsers[idx] = this.banUsers[idx].filter(
      (item) => item.intraId !== intraId,
    );
  }

  async getChannelBanUsers(idx: number) {
    await this.findOneById(idx);
    return this.banUsers[idx];
  }

  // message

  async sendMessage(chanName: string, nickName: string, message: string) {
    const channel = await this.findOneByName(chanName);
    this.messageList[channel.chIdx].push({ nickName, message });
  }

  async getMessageList(idx: number, intraId: string) {
    // ban check
    await this.findOneById(idx);
    if (this.banUsers[idx].find((user) => user.intraId === intraId)) return;
    return this.messageList[idx];
  }

  // mute
  async muteUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId, nickName } = channelUserDto;
    await this.findOneById(idx);
    const foundUser = this.mutedUsers[idx].find(
      (user) => user.intraId === intraId,
    );

    // reset
    if (foundUser) {
      clearTimeout(foundUser.timeoutId);
      this.mutedUsers[idx] = this.mutedUsers[idx].filter(
        (user) => user.intraId !== intraId,
      );
    }

    const timeoutId = setTimeout(() => {
      this.unmuteUser(idx, intraId);
    }, 1 * 60 * 1000);
    this.mutedUsers[idx].push({ intraId, nickName, timeoutId });
  }

  async unmuteUser(idx: number, intraId: string) {
    if (this.mutedUsers[idx].find((id) => id.intraId === intraId)) {
      this.mutedUsers[idx] = this.mutedUsers[idx].filter(
        (user) => user.intraId !== intraId,
      );
      console.log('unmute');
    }
  }

  async ismuted(chanName: string, nickName: string) {
    const channel = await this.findOneByName(chanName);
    const ismuted = this.mutedUsers[channel.chIdx].find(
      (user) => user.nickName === nickName,
    );
    if (ismuted && ismuted !== undefined) return true;
    return false;
  }
}
