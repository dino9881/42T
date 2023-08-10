import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ChannelUserDto } from './dto/channel-user.dto';
import * as bcrypt from 'bcrypt';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';
import { MemberService } from 'src/member/member.service';
import { channelConstants } from 'src/util/constants';

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
    if (channels && channels.find(chan => chan.chName === chName))
      return true;
    return false;
  }

  async create(member: ChannelUserDto, createChannelDto: CreateChannelDto) {
    if (createChannelDto.chPwd !== "" && createChannelDto.chPwd !== undefined) {
      createChannelDto = await this.hashPassword(createChannelDto);
    }
    const { chName, chPwd, isDM, isPrivate } = createChannelDto;

    if (chName === undefined || chName === "")
      throw new BadRequestException('Bad request');
    // member check
    await this.memberService.getOne(member.intraId);
    // operator check
    const oper = await this.prisma.member.findUnique({
      where: { intraId: member.intraId },
      include: { channel: true },
    });
    if (oper?.channel.length >= channelConstants.OPERATOR_CNT) {
      throw new ForbiddenException('Already oper on 3 channel');
    }
    // duplicate name check
    if (await this.isDuplicateName(chName))
      throw new ConflictException('Duplicate chName');
    const createData = await this.prisma.channel.create({
      data: {
        chName,
        chUserCnt: 1,
        chPwd,
        isDM: isDM === undefined ? false : isDM,
        isPrivate: isPrivate === undefined ? false : isPrivate,
        owner: { connect: { intraId: member.intraId } },
      },
    });
    // initialize
    this.administrators[createData.chIdx] = [];
    this.channelUsers[createData.chIdx] = [
      { intraId: member.intraId, avatar: member.avatar, nickName: member.nickName },];
    this.banUsers[createData.chIdx] = [];
    this.messageList[createData.chIdx] = [];
    this.mutedUsers[createData.chIdx] = [];
    this.pair[createData.chIdx] = {user1:"", user2:""};
    return createData;
  }

  async hashPasswordModify(channel: UpdateChannelDto) {
    const salt = await bcrypt.genSalt(10);
    channel.chPwd = await bcrypt.hash(channel.chPwd, salt);
  }

  async updatePwd(idx: number, intraId: string, updateChannelDto: UpdateChannelDto) {
    const { chPwd } = updateChannelDto;
    await this.findOneById(idx);
    // auth check
    if (!this.isOwner(idx, intraId))
      throw new ForbiddenException("no permissions");
    // hashing
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

  async updateNickName(intraId: string, nickName: string) {
    const channels = await this.findAll();
    channels.map(chan => {
      this.channelUsers[chan.chIdx].map(users => {
        if (users.intraId === intraId)
          users.nickName = nickName;
      })
    })
  }

  async delete(idx: number) {
    await this.findOneById(idx);
    await this.prisma.channel.delete({ where: { chIdx: idx } });
    this.administrators[idx] = [];
    this.channelUsers[idx] = [];
    this.banUsers[idx] = [];
    this.messageList[idx] = [];
    this.mutedUsers[idx] = [];
    this.pair[idx] = {user1: "", user2: ""};
  }

  async findAll() {
    return await this.prisma.channel.findMany();
  }
  
  async findChannelAll() {
    return await this.prisma.channel.findMany({ where: { isDM: false, isPrivate: false } });
  }
  
  async findOneById(idx: number) {
    const findData = await this.prisma.channel.findUnique({
      where: { chIdx: idx },
    });
    if (findData === null) throw new NotFoundException('channel not found');
    return findData;
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
  
  async isChanUser(idx:number, intraId: string) {
    await this.findOneById(idx);
    if (this.channelUsers[idx].find(user => user.intraId === intraId))
      return true;
    return false;
  }

  async isAuthor(idx: number, intraId: string) {
    if (await this.isOwner(idx, intraId) || await this.isAdmin(idx, intraId))
      return true;
    return false;
  }

  async isOwner(idx: number, intraId: string) {
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
    // owner 인지 체크
    if (!await this.isOwner(idx, intraId))
      throw new ForbiddenException("no permissions");
    // 상대가 owner 인지 체크
    if (await this.isOwner(idx, channelUserDto.intraId))
      throw new ForbiddenException("no permissions");
    // 채널에 들어와있는 user 인지 체크
    if (!await this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');
    if (this.administrators[idx].find(user => user.intraId === channelUserDto.intraId))
      return;
    this.administrators[idx].push({ intraId: channelUserDto.intraId });
  }

  async isDM(idx: number) {
    const channel = await this.findOneById(idx);
    return channel.isDM;
  }

  // channel users

  async enter(idx: number, member: MemberInfoDto, updateChannelDto: UpdateChannelDto) {
    const { intraId, avatar, nickName } = member;
    const channel = await this.findOneById(idx);

    // pwd check
    if (channel.chPwd) { 
      if (!await this.checkPassword(idx, updateChannelDto))
        throw new BadRequestException('wrong password');
    }
    // user check
    if (this.channelUsers[idx].find((user) => user.intraId === member.intraId))
      return channel;
    // ban check
    this.banUsers[idx].map((data) => {
      if (data.intraId === member.intraId) {
        throw new ForbiddenException('banned user');
      }
    });
    // max check
    if (channel.chUserCnt >= channelConstants.USER_CNT) throw new ForbiddenException('max capacity');

    const updatedChannel = await this.prisma.channel.update({
      where: { chIdx: idx },
      data: {
        chUserCnt: { increment: 1 },
      },
    });
    this.channelUsers[idx].push({ intraId, avatar, nickName });
    return updatedChannel;
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
     // 관리자일 경우, 채널에 아무도 없을 때 채널 삭제
     if (await this.isOwner(idx, memberId) || updatedChannel.chUserCnt <= 0) {
      await this.delete(idx);
      return true;
    } 
    return false;
  }

  async kick(idx: number, operId: string, channelUserDto: ChannelUserDto) {
    await this.findOneById(idx);
    if (!await this.isOwner(idx, operId) && !await this.isAdmin(idx, operId))
      throw new ForbiddenException('no permissions');
    if (await this.isOwner(idx, channelUserDto.intraId))
      throw new ForbiddenException('no permissions');
    if (!await this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');
    await this.prisma.channel.update({
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
    if (users && users.find((user) => user.nickName === nickName)) return true;
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

  async saveBanUser(idx: number, operId: string, channelUserDto: ChannelUserDto) {
    const { intraId } = channelUserDto;
    await this.findOneById(idx);
    if (!await this.isOwner(idx, operId) && !await this.isAdmin(idx, operId))
      throw new ForbiddenException('no permissions');
    if (await this.isOwner(idx, channelUserDto.intraId))
      throw new ForbiddenException('no permissions');
    if (!await this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');
    if (this.banUsers[idx].find(user => user.intraId === intraId))
      return ;
    await this.kick(idx, operId, channelUserDto);
    this.banUsers[idx].push({ intraId });
  }

  async getChannelBanUsers(idx: number) {
    await this.findOneById(idx);
    return this.banUsers[idx];
  }

  async isBan(chName: string, intraId: string) {
    const channel = await this.findOneByName(chName);
    if (await this.isDM(channel.chIdx)){
      const isDMBan = await this.memberService.isDMBan(this.pair[channel.chIdx].user1, this.pair[channel.chIdx].user2);
      if (isDMBan)
        return true;
    } else {
      const banUsers = await this.getChannelBanUsers(channel.chIdx);
      if (banUsers && banUsers.find(users => users.intraId === intraId))
        return true;
    }
    return false;
  }

  // message

  async sendMessage(chanName: string, nickName: string, message: string, avatar: string) {
    const channel = await this.findOneByName(chanName);
    this.messageList[channel.chIdx].push({ nickName, message, avatar });
  }

  async getMessageList(idx: number, member: MemberInfoDto) {
    await this.findOneById(idx);
    return this.messageList[idx];
  }

  // mute

  async muteUser(idx: number, operId: string, channelUserDto: ChannelUserDto) {
    const { intraId, nickName } = channelUserDto;
    await this.findOneById(idx);
    if (!await this.isOwner(idx, operId) && !await this.isAdmin(idx, operId))
      throw new ForbiddenException('no permissions');
    if (await this.isOwner(idx, channelUserDto.intraId))
      throw new ForbiddenException('no permissions');
    if (!await this.isChanUsersById(idx, channelUserDto.intraId))
      throw new NotFoundException('user not found');

    const foundUser = this.mutedUsers[idx].find(
      (user) => user.intraId === intraId,
    );
    // 이미 mute 되어있으면 reset 후 다시 실행
    if (foundUser) {
      clearTimeout(foundUser.timeoutId);
      this.mutedUsers[idx] = this.mutedUsers[idx].filter(
        (user) => user.intraId !== intraId,
      );
    }
    // 9분 후 unmute 실행
    const timeoutId = setTimeout(() => {
      this.unmuteUser(idx, intraId);
    }, channelConstants.MUTE_TIME);
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
    // member check
    await this.memberService.getOneByNick(channelUserDto.nickName);
    const user1 = member.intraId < channelUserDto.intraId ? member.intraId : channelUserDto.intraId;
    const user2 = member.intraId < channelUserDto.intraId ? channelUserDto.intraId : member.intraId;
    const chName = "#" + user1 + user2;
    // 이미 존재하면 채널 정보 반환
    if (this.isAlreadyDM(user1, user2)) {
      const data = await this.prisma.channel.findUnique({
        where: { chName: chName }
      });
      return data;
    }
    // 채널 생성
    const createData = await this.prisma.channel.create({
      data: {
        chName,
        chUserCnt: 2,
        isDM: true,
        owner: { connect: { intraId: "admin" } }
      },
    });
    // initialize
    this.pair[createData.chIdx] = { user1, user2 };
    this.channelUsers[createData.chIdx] = [
      { intraId: user1, avatar: '', nickName: '' },
      { intraId: user2, avatar: '', nickName: '' },
    ];
    this.banUsers[createData.chIdx] = [];
    this.messageList[createData.chIdx] = [];
    this.mutedUsers[createData.chIdx] = [];
    this.administrators[createData.chIdx] = [];
    return createData;
  }
  
  async getMyDMChannels(intraId: string) {
    let channels = [];
    const allChannel = await this.findDMAll();
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

  async isFirstMessage(chanName: string, intraId: string) {
    const channel = await this.findOneByName(chanName);
    if (!await this.isDM(channel.chIdx) || this.messageList[channel.chIdx].length > 0)
      return "";
    if (this.pair[channel.chIdx].user1 === intraId)
      return this.pair[channel.chIdx].user2;
    else
      return this.pair[channel.chIdx].user1;
  }
  
  async findDMAll() {
    return await this.prisma.channel.findMany({ where: { isDM: true } });
  }

  // private

  async findPrivateChannelAll() {
    return await this.prisma.channel.findMany({ where: { isPrivate: true } });
  }

  async isPrivate(idx: number) {
    const channel = await this.findOneById(idx);
    return channel.isPrivate;
  }

  async getMyPrivateChannels(intraId: string) {
    let channels = [];
    const allChannel = await this.findPrivateChannelAll();
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

  async channelInvite(chanName: string, channelUserDto: ChannelUserDto) {
    const { intraId, avatar, nickName } = channelUserDto;
    const channel = await this.findOneByName(chanName);
    // user check
    if (this.channelUsers[channel.chIdx].find((user) => user.intraId === intraId))
      return ;
    // max check
    if (channel.chUserCnt >= channelConstants.USER_CNT) throw new ForbiddenException('max capacity');
    await this.prisma.channel.update({
      where: { chIdx: channel.chIdx },
      data: {
        chUserCnt: { increment: 1 },
      },
    });
    this.channelUsers[channel.chIdx].push({ intraId, avatar, nickName });
  }
}
