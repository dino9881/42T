import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { HttpStatusCode } from 'axios';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { MemberInfoDto } from './dto/member-info.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

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
    //intra id 중복체크
    await this.checkIntraIdDuplicate(memberDto.intraId);
    //nickname 중복체크
    await this.checkNickDuplicate(memberDto.nickName);
    // member 생성
    await this.prisma.member.create({
      data: {
        ...memberDto,
        rank: 100, // 기본 랭크 100
        currentRefreshTokenExp: undefined,
        currentRefreshToken: undefined,
      },
    });
    return HttpStatus.CREATED;
  }

  async updateNick(member: MemberInfoDto, updateDto: UpdateMemberDto) {
    await this.checkNickDuplicate(updateDto.nickName);
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: updateDto,
    });
    return HttpStatusCode.Ok;
  }

  async updateAvatar(member: MemberInfoDto, updateInfo: UpdateMemberDto) {
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: updateInfo,
    });
    return HttpStatusCode.Ok;
  }

  async updateRank(id: string, modifyRank: number) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { rank: { increment: modifyRank } },
    });
    return HttpStatusCode.Ok;
  }

  async updateWinCnt(id: string) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { winCnt: { increment: 1 } },
    });
    return HttpStatusCode.Ok;
  }

  async updateLoseCnt(id: string) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: { loseCnt: { increment: 1 } },
    });
    return HttpStatusCode.Ok;
  }

  async delete(id: string) {
    const member = await this.getOne(id);
    if (member == null) {
      throw new NotFoundException('Member Not Found');
    }
    await this.prisma.member.delete({
      where: { intraId: id },
    });
    return HttpStatus.OK;
  }

  async isFriend(member: MemberInfoDto, friend: MemberInfoDto) {
    const isFriend = await this.prisma.member.findUnique({
      where: {
        intraId: member.intraId,
      },
      select: {
        friend: {
          where: {
            intraId: friend.intraId,
          },
        },
      },
    });
    if (isFriend.friend.length) {
      return true;
    } else {
      return false;
    }
  }

  async searchMember(member: MemberInfoDto, nickName: string) {
    const friend = await this.getOneByNick(nickName);
    const isFriend = this.isFriend(member, friend);
    if (isFriend) {
      return { ...friend, isFriend: true };
    } else {
      return { ...friend, isFriend: false };
    }
  }

  async getCurrentHashedRefreshToken(refreshToken: string) {
    // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다.
    // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다.
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    return currentRefreshToken;
  }

  async getCurrentRefreshTokenExp(): Promise<Date> {
    const currentDate = new Date();
    // Date 형식으로 데이터베이스에 저장하기 위해 문자열을 숫자 타입으로 변환 (paresInt)
    const currentRefreshTokenExp = new Date(
      currentDate.getTime() +
        parseInt(this.config.get('JWT_REFRESH_EXPIRATION_TIME')),
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
    if (!member.currentRefreshToken) {
      return null;
    }
    // 유저 테이블 내에 정의된 암호화된 refresh_token값과 요청 시 body에 담아준 refresh_token값 비교
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      member.currentRefreshToken,
    );
    // 만약 isRefreshTokenMatching이 true라면 user 객체를 반환
    if (isRefreshTokenMatching) {
      return member;
    }
    throw new UnauthorizedException('Invalid Refresh Token');
  }

  async addFriend(member: MemberInfoDto, friendNick: string) {
    const friend = await this.getOneByNick(friendNick);
    const isFriend = await this.isFriend(member, friend);
    if (isFriend) {
      throw new ConflictException(
        'Already Friend',
        `IntraId : ${friend.intraId}`,
      );
    }
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { friend: { connect: { intraId: friend.intraId } } },
    });
    console.log(friend);
    return HttpStatus.OK;
  }

  async deleteFriend(member: MemberInfoDto, friendNick: string) {
    const friend = await this.getOneByNick(friendNick);
    const isFriend = await this.isFriend(member, friend);
    if (!isFriend) {
      throw new NotFoundException(
        'Cannot Find Friend',
        `IntraId : ${friend.intraId}`,
      );
    }
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { friend: { disconnect: { intraId: friend.intraId } } },
    });
    return HttpStatus.OK;
  }

  async getFriendList(member: MemberInfoDto) {
    const friendList = await this.prisma.member.findMany({
      where: { friendOf: { some: { intraId: member.intraId } } },
    });
    console.log(friendList);
    return friendList;
  }

  async isBan(member: MemberInfoDto, banMember: MemberInfoDto) {
    const isBan = await this.prisma.member.findUnique({
      where: {
        intraId: member.intraId,
      },
      select: {
        banned: {
          where: {
            intraId: banMember.intraId,
          },
        },
      },
    });
    if (isBan.banned.length) {
      return true;
    } else {
      return false;
    }
  }

  async banMember(member: MemberInfoDto, nickName: string) {
    const banMember = await this.getOneByNick(nickName);
    const isFriend = await this.isFriend(member, banMember);
    if (isFriend) {
      await this.deleteFriend(member, nickName);
    }
    const isBan = await this.isBan(member, banMember);
    if (isBan) {
      throw new ConflictException(
        'Already Banned Member',
        `IntraId : ${banMember.intraId}`,
      );
    }
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { banned: { connect: { intraId: banMember.intraId } } },
    });
    return HttpStatus.OK;
  }

  async unbanMember(member: MemberInfoDto, nickName: string) {
    const unbanMember = await this.getOneByNick(nickName);
    const isBan = await this.isBan(member, unbanMember);
    if (!isBan) {
      throw new NotFoundException(
        'Cannot Find Ban Member',
        `IntraId : ${unbanMember.intraId}`,
      );
    }
    await this.prisma.member.update({
      where: { intraId: member.intraId },
      data: { banned: { disconnect: { intraId: unbanMember.intraId } } },
    });
    return HttpStatus.OK;
  }
}
