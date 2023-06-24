import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { HttpStatusCode } from 'axios';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

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

  async checkIntraIdDuplicate(IntraId: string) {
    const member = await this.prisma.member.findUnique({
      where: { intraId: IntraId },
    });
    if (member)
      throw new ConflictException(
        'IntraId Already Exist',
        `IntraId : ${IntraId}`,
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
        currentRefreshTokenExp: undefined,
        currentRefreshToken: undefined,
      },
    });
    return HttpStatus.CREATED;
  }

  async updateNick(id: string, memberDto: UpdateMemberDto) {
    await this.checkNickDuplicate(memberDto.nickName);
    await this.prisma.member.update({
      where: { intraId: id },
      data: memberDto,
    });
    return HttpStatusCode.Ok;
  }

  async updateAvatar(id: string, memberDto: UpdateMemberDto) {
    await this.prisma.member.update({
      where: { intraId: id },
      data: memberDto,
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
  }
}
