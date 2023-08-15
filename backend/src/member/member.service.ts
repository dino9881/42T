import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Member, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MemberInfoDto } from './dto/member-info.dto';
import jwtConfig from 'src/config/jwt.config';
import { memberConstants, statusConstants } from 'src/util/constants';

@Injectable()
export class MemberService {
  constructor(
    private prisma: PrismaService,
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async createAdminMember() {
    const adminMember = await this.prisma.member.findUnique({
      where: { intraId: memberConstants.ADMIN },
    });
    if (adminMember) return;
    const adminMemberData = {
      intraId: memberConstants.ADMIN,
      nickName: memberConstants.ADMIN,
      avatar: memberConstants.ADMIN + '.jpg',
      rank: memberConstants.RANK,
      currentRefreshTokenExp: undefined,
      currentRefreshToken: undefined,
      status: statusConstants.ONLINE,
    };
    await this.prisma.member.create({ data: adminMemberData });
  }

  async generateTFACode() {
    //6 digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    return code;
  }

  async verifyTFACode(req: Request, code: string) {
    const answer = req.signedCookies['code'];
    if (answer !== undefined && code !== null && code === answer) return;
    else throw new BadRequestException('Code Not Match', code + ' ' + answer);
  }

  // 전체 유저 확인 용 메소드
  async getAll() {
    const members = this.prisma.member.findMany();
    return members;
  }

  async getOne(intraId: string) {
    const member = await this.prisma.member.findUnique({
      where: { intraId },
    });
    if (member === null) {
      throw new NotFoundException('Member Not Found by IntraId', intraId);
    }
    return member;
  }

  async getOneByNick(nickName: string) {
    const member = await this.prisma.member.findUnique({
      where: { nickName },
    });
    if (member === null) {
      throw new NotFoundException('Member Not Found by nickName', nickName);
    }
    return member;
  }

  async checkNickDuplicate(nick: string) {
    const member = await this.prisma.member.findUnique({
      where: { nickName: nick },
    });
    if (member)
      throw new ConflictException(
        'NickName Already Exist',
        `nickName : ${nick}`,
      );
    return member;
  }

  async checkIntraIdDuplicate(intraId: string) {
    const member = await this.prisma.member.findUnique({
      where: { intraId: intraId },
    });
    if (member)
      throw new ConflictException(
        'IntraId Already Exist',
        `IntraId : ${intraId}`,
      );
  }

  async create(memberDto: CreateMemberDto) {
    await this.checkIntraIdDuplicate(memberDto.intraId);
    await this.checkNickDuplicate(memberDto.nickName);
    await this.prisma.member.create({
      data: {
        ...memberDto,
        rank: memberConstants.RANK,
        currentRefreshTokenExp: undefined,
        currentRefreshToken: undefined,
        status: statusConstants.ONLINE,
      },
    });
    return;
  }

  async updateNick(member: MemberInfoDto, updateDto: UpdateMemberDto) {
    await this.checkNickDuplicate(updateDto.nickName);
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: updateDto,
    });
    return;
  }

  async updateAvatar(member: MemberInfoDto, updateInfo: UpdateMemberDto) {
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: updateInfo,
    });
    return;
  }

  async updateRank(id: string, modifyRank: number) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { rank: { increment: modifyRank } },
    });
    return;
  }

  async updateWinCnt(id: string) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { winCnt: { increment: 1 } },
    });
    return;
  }

  async updateLoseCnt(id: string) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { loseCnt: { increment: 1 } },
    });
    return;
  }

  async updateStatus(id: string, status: number) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { status: status },
    });
    return;
  }

  async delete(id: string) {
    const member = await this.getOne(id);
    if (member == null) {
      throw new NotFoundException('Member Not Found');
    }
    await this.prisma.member.delete({
      where: { intraId: id },
    });
    return;
  }

  async isFriend(member: MemberInfoDto, friend: Member) {
    const isFriend = await this.prisma.member
      .findUnique({
        where: { intraId: member.intraId },
      })
      .friend({
        where: { intraId: friend.intraId },
        select: { intraId: true },
      });
    if (isFriend.length) return true;
    else return false;
  }

  async searchMember(
    member: MemberInfoDto,
    nickName: string,
  ): Promise<MemberInfoDto> {
    if (nickName == memberConstants.ADMIN)
      throw new NotAcceptableException('Cannot Search Admin');
    const friend = await this.getOneByNick(nickName);
    const isFriend = await this.isFriend(member, friend);
    const isBan = await this.isBan(member, friend);
    return { ...friend, isFriend: isFriend, isBan: isBan };
  }

  async getCurrentHashedRefreshToken(refreshToken: string) {
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp() {
    const currentDate = new Date();
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() + this.jwt.accessExpire,
    );
    return currentRefreshTokenExp;
  }

  async setCurrentRefreshToken(refreshToken: string, intraId: string) {
    const currentRefreshToken = await this.getCurrentHashedRefreshToken(
      refreshToken,
    );
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.prisma.member.update({
      where: { intraId: intraId },
      data: {
        currentRefreshToken: currentRefreshToken,
        currentRefreshTokenExp: currentRefreshTokenExp,
      } as Prisma.MemberUpdateInput,
    });
  }

  async getMemberIfRefreshTokenMatches(refreshToken: string, intraId: string) {
    const member: Member = await this.getOne(intraId);
    // user에 currentRefreshToken이 없다면 null을 반환 (즉, 토큰 값이 null일 경우)
    // user가 한번도 auth/login을 호출한적이 없다는 뜻 => auth/login을 호출하도록 유도
    if (!member.currentRefreshToken) return null;
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      member.currentRefreshToken,
    );
    if (isRefreshTokenMatching) return member;
    throw new UnauthorizedException('Invalid Refresh Token');
  }

  async addFriend(member: MemberInfoDto, friendNick: string) {
    if (friendNick == memberConstants.ADMIN)
      throw new NotAcceptableException('Cannot Add Admin');
    const friend = await this.getOneByNick(friendNick);
    const isFriend = await this.isFriend(member, friend);
    if (isFriend)
      throw new ConflictException(
        'Already Friend',
        `IntraId : ${friend.intraId}`,
      );
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { friend: { connect: { intraId: friend.intraId } } },
    });
    return;
  }

  async deleteFriend(member: MemberInfoDto, friendNick: string) {
    const friend = await this.getOneByNick(friendNick);
    const isFriend = await this.isFriend(member, friend);
    if (!isFriend)
      throw new NotFoundException(
        'Cannot Find Friend',
        `IntraId : ${friend.intraId}`,
      );
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { friend: { disconnect: { intraId: friend.intraId } } },
    });
    return;
  }

  async getFriendList(member: MemberInfoDto) {
    const friendList = await this.prisma.member.findMany({
      where: { friendOf: { some: { intraId: member.intraId } } },
    });
    console.log(friendList);
    return friendList;
  }

  async isBan(member: MemberInfoDto, banMember: Member) {
    const isBan = await this.prisma.member
      .findUnique({
        where: { intraId: member.intraId },
      })
      .banned({
        where: { intraId: banMember.intraId },
        select: { intraId: true },
      });
    if (isBan.length) return true;
    else return false;
  }

  async isBanByintraId(intraId: string, banIntraId: string) {
    const isBan = await this.prisma.member
      .findUnique({
        where: { intraId: intraId },
      })
      .banned({
        where: { intraId: banIntraId },
        select: { intraId: true },
      });
    if (isBan.length) return true;
    else return false;
  }
  
  async isDMBan(member: string, banMember: string) {
    const isBan = await this.prisma.member.findMany({
      where: { intraId: member },
      select: {
        bannedOf: { where: { intraId: banMember } },
        banned: { where: { intraId: banMember } },
      },
    });
    return isBan[0]?.bannedOf.length > 0 || isBan[0]?.banned.length > 0;
  }

  async getBanList(member: MemberInfoDto) {
    const banList = await this.prisma.member.findMany({
      where: { bannedOf: { some: { intraId: member.intraId } } },
    });
    console.log(banList);
    return banList;
  }

  async banMember(member: MemberInfoDto, nickName: string) {
    if (nickName == memberConstants.ADMIN)
      throw new NotAcceptableException('Cannot Ban Admin');
    const banMember = await this.getOneByNick(nickName);
    const isFriend = await this.isFriend(member, banMember);
    if (isFriend) await this.deleteFriend(member, nickName);
    const isBan = await this.isBan(member, banMember);
    if (isBan)
      throw new ConflictException(
        'Already Banned Member',
        `IntraId : ${banMember.intraId}`,
      );
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { banned: { connect: { intraId: banMember.intraId } } },
    });
    return;
  }

  async unbanMember(member: MemberInfoDto, nickName: string) {
    const unbanMember = await this.getOneByNick(nickName);
    const isBan = await this.isBan(member, unbanMember);
    if (!isBan)
      throw new NotFoundException(
        'Cannot Find Ban Member',
        `IntraId : ${unbanMember.intraId}`,
      );
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { banned: { disconnect: { intraId: unbanMember.intraId } } },
    });
    return;
  }

  async getSevenRanks() {
    const ranks = await this.prisma.member.findMany({
      orderBy: { rank: 'desc' },
      take: 7,
    });
    console.log(ranks);
    return { length: ranks.length, data: ranks };
  }

  async toggleTwoFactor(member: MemberInfoDto, updateDto: UpdateMemberDto){
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: updateDto,
    });
    return;  
  }
}
