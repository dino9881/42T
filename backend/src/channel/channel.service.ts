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
import { MemberService } from 'src/member/member.service';


@Injectable()
export class ChannelService {

  private channelUsers: Record<number, { intraId: string, avatar: string, nickName: string }[]>;
  private messageList: Record<number, { nickName: string, message: string, avatar:string }[]>;
  private administrators: Record<number, { intraId: string }[]>;
  private banUsers: Record<number, { intraId: string }[]>;
  private mutedUsers: Record<
    number,
    { intraId: string; nickName: string; timeoutId: NodeJS.Timeout }[]
  >;
  private pair: Record<number, { user1: string, user2: string }>;

  constructor(private prisma: PrismaService, private memberService: MemberService) {
    
    this.administrators = {};
    this.channelUsers = {};
    this.banUsers = {};
    this.messageList = {};
    this.mutedUsers = {};
    this.pair = {};
  }

  async hashPassword(channel: CreateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
    return channel;
  }

  async isDuplicateName(chName: string) {
    const channels = await this.findChannelAll();
    if (channels.find(chan => chan.chName === chName))
      return true;
    return false;
  }

  async create(member: MemberInfoDto, createChannelDto: CreateChannelDto) {
    let createData ;

    console.log("비밀번호" + createChannelDto.chPwd);
    if (createChannelDto.chPwd !== undefined) {
      createChannelDto = await this.hashPassword(createChannelDto);
    }
    const { chName, chPwd, isDM } = createChannelDto;

    // operator 수 체크
    const oper = await this.prisma.member.findUnique({
      where: { intraId: member.intraId },
      include: { channel: true },
    });
    if (oper?.channel.length >= 3) {
      throw new ForbiddenException('Already oper on 3 channel');
    }
    // duplicate check
    await this.memberService.getOne(member.intraId);
    try {
      createData = await this.prisma.channel.create({
        data: {
          chName,
          chUserCnt: 1,
          chPwd,
          isDM: isDM === undefined ? false : isDM,
          owner: { connect: { intraId: member.intraId } },
        },
      });
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
      
      this.administrators[createData.chIdx] = [];
      this.channelUsers[createData.chIdx] = [
        { intraId: member.intraId, avatar: member.avatar, nickName: member.nickName },
      ];
      this.banUsers[createData.chIdx] = [];
      this.messageList[createData.chIdx] = [];
      this.mutedUsers[createData.chIdx] = [];

      return createData;
  }

  async hashPasswordModify(channel: UpdateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
  }

  // 삭제도 되는지 확인
  async updatePwd(idx: number, intraId: string, updateChannelDto: UpdateChannelDto) {
    const { chPwd } = updateChannelDto;
    if (!this.isOperator(idx, intraId))
      throw new ForbiddenException("no permissions");
    if (chPwd !== undefined && chPwd !== "") {
      await this.hashPasswordModify(updateChannelDto);
    }
    const updateData = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: { chPwd: updateChannelDto.chPwd },
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
    this.administrators[idx] = [];
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
    const { ownerId } = channel;
    if (ownerId === intraId) return true;
    return false;
  }

  async isAdmin(idx: number, intraId: string) { 
    await this.findOneById(idx);
    if (this.administrators[idx].find(user => user.intraId === intraId))
      return true;
    return false;
  }

  async setAdmin(idx: number, intraId: string, channelUserDto: ChannelUserDto) {
    await this.findOneById(idx);
    if (!this.isOperator(idx, intraId))
      throw new ForbiddenException("no permissions");
    if (!this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');
    if (this.administrators[idx].find(user => user.intraId === channelUserDto.intraId))
      return;
    this.administrators[idx].push({ intraId: channelUserDto.intraId });
  }

  async isDM(idx: number) {
    const channel = await this.findOneById(idx);
    const { isDM } = channel;
    if (isDM === true) return true;
    return false;
  }

  // channel users

  async enter(idx: number, member: MemberInfoDto) {
    const { intraId, avatar, nickName } = member;
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
    this.channelUsers[idx].push({ intraId, avatar, nickName });
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
      (user) => user.intraId !== memberId,
    );
    this.administrators[idx] = this.administrators[idx].filter(
      (user) => user.intraId !== memberId
    );
    
    // 아무도 안 남을 경우 채널 삭제
    if (updatedChannel.chUserCnt <= 0) this.delete(idx);
    // oper 가 나갔을 때 다음 사람 oper 설정
    else if (memberId === updatedChannel.ownerId) {
      await this.prisma.channel.update({
        where: { chIdx: idx },
        data: { ownerId: null },
      });
    }
  }

  async kick(idx: number, intraId: string, channelUserDto: ChannelUserDto) {
    await this.findOneById(idx);
    if (this.isOperator(idx, channelUserDto.intraId))
      throw new ForbiddenException('no permissions');
    if (!this.isOperator(idx, intraId) && !this.isAdmin(idx, intraId))
      throw new ForbiddenException('no permissions');
    if (this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');
    const updatedChannel = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: {
        chUserCnt: { decrement: 1 },
      },
    });
    this.channelUsers[idx] = this.channelUsers[idx].filter(
      (item) => item.intraId !== channelUserDto.intraId,
    );
  }

  async getChannelUsers(idx: number, member: MemberInfoDto) {
    await this.findOneById(idx);
    const chanUsers = this.channelUsers[idx].filter( 
      user => user.intraId !== member.intraId);
    return chanUsers;
  }

  async isChanUsers(chanName: string, nickName: string) {
    const channel = await this.findOneByName(chanName);
    const users = this.channelUsers[channel.chIdx];
    if (users.find((user) => user.nickName === nickName)) return true;
    return false;
  }

  async isChanUsersById(idx: number, intraId: string) {
    await this.findOneById(idx);
    if (this.channelUsers[idx].find(user => user.intraId === intraId))
      return true;
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

  // ban 
  async saveBanUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId } = channelUserDto;
    await this.findOneById(idx);
    if (this.isOperator(idx, channelUserDto.intraId))
      throw new ForbiddenException('no permissions');
    if (!this.isOperator(idx, intraId) && !this.isAdmin(idx, intraId))
      throw new ForbiddenException('no permissions');
    if (this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');
    if (this.banUsers[idx].find(user => user.intraId === intraId))
      return ;
    this.banUsers[idx].push({ intraId });
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

  async sendMessage(chanName: string, nickName: string, message: string, avatar: string) {
    const channel = await this.findOneByName(chanName);
    this.messageList[channel.chIdx].push({ nickName, message, avatar });
  }

  async getMessageList(idx: number, member: MemberInfoDto) {
    // ban check
    const channel = await this.findOneById(idx);
    if (this.banUsers[idx].find((user) => user.intraId === member.intraId)) return {};
    if (this.isDM(idx)) {
      if (await this.memberService.isDMBan(this.pair[idx].user1, this.pair[idx].user2))
          return null;
    }
    return this.messageList[idx];
  }

  // mute
  async muteUser(idx: number, channelUserDto: ChannelUserDto) {
    const { intraId, nickName } = channelUserDto;
    await this.findOneById(idx);
    if (this.isOperator(idx, channelUserDto.intraId))
      throw new ForbiddenException('no permissions');
    if (!this.isOperator(idx, intraId) && !this.isAdmin(idx, intraId))
      throw new ForbiddenException('no permissions');
    if (this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');

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

  // DM
  async enterDM(member: MemberInfoDto, channelUserDto: ChannelUserDto) {
    let user1: string, user2: string;
    
    await this.memberService.getOneByNick(channelUserDto.nickName);

    if (member.intraId < channelUserDto.intraId) {
      user1 = member.intraId;
      user2 = channelUserDto.intraId;
    } else {
      user1 = channelUserDto.intraId;
      user2 = member.intraId;
    }
    const chName = "#" + user1 + user2;
    if (this.isAlreadyDM(user1, user2)) {
      const data = await this.prisma.channel.findUnique({
        where: { chName: chName }
      });
      return data;
    }
    const createData = await this.prisma.channel.create({
      data: {
        chName,
        chUserCnt: 2,
        isDM: true,
        owner: { connect: { intraId: "admin" } }
      },
    });

    this.pair[createData.chIdx] = { user1, user2 };
    this.channelUsers[createData.chIdx] = [
      { intraId: user1, avatar: '', nickName: '' },
      { intraId: user2, avatar: '', nickName: '' },
    ];

    this.banUsers[createData.chIdx] = [];
    this.messageList[createData.chIdx] = [];
    this.mutedUsers[createData.chIdx] = [];
    return createData;
  }
  
  async getMyDMChannels(intraId: string) {
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
  
  isAlreadyDM(user1: string, user2: string) {
    for (const idx in this.pair) {
      if (this.pair[idx].user1 === user1 && this.pair[idx].user2 === user2)
        return true;
    }
    return false;
  }

  async isDMBan(chName: string, nickName: string) {
    const channel = await this.findOneByName(chName);
    const isDMBan = await this.memberService.isDMBan(this.pair[channel.chIdx].user1, this.pair[channel.chIdx].user2);
    console.log(isDMBan);
    if (isDMBan)
      return true;
    return false;
  }
}
