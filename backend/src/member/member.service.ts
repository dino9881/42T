import {
  BadRequestException,
  ConsoleLogger,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Member, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { HttpStatusCode } from 'axios';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async getAll() {
    const members = this.prisma.member.findMany();
    if (members) {
      return members;
    } else {
      throw new NotFoundException('member/all failed');
    }
  }

  async getOne(intraId: string) {
    let member;
    try {
      member = await this.prisma.member.findUnique({
        where: { intraId },
      });
      console.log(member);
    } catch (err) {
      throw new NotFoundException(err.message);
    }
    if (member === null) {
      throw new NotFoundException('Member Not Found');
    }
    return member;
  }

  async getOneByNick(nick: string) {
    try {
      const member = await this.prisma.member.findUnique({
        where: { nickName: nick },
      });
      return member;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async create(memberDto: CreateMemberDto) {
    //멤버의 인자가 맞지 않을 경우 처리필요?
    await this.prisma.member.create({
      data: {
        ...memberDto,
        currentRefreshTokenExp: undefined,
        currentRefreshToken: undefined,
      },
    });
    return HttpStatus.CREATED;
    // try {
    //   const memberNick = await this.getOneByNick(memberDto.nickName);
    //   if (memberNick)
    //     throw new HttpException(
    //       'NickName Already Exist',
    //       HttpStatusCode.Conflict,
    //     );
    //   try {
    //     const memberId = await this.getOne(memberDto.nickName);
    //     if (memberId)
    //       throw new HttpException(
    //         'IntraId Already Exist',
    //         HttpStatusCode.Conflict,
    //       );
    //   } catch (err) {
    //     if (err.HttpStatus == HttpStatusCode.NotFound) {
    //       return HttpStatus.CREATED;
    //     }
    //   }
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    //멤버 테이블에 저장을 실패했을 경우 > 언제가 있을까?
    // }
    // throw new HttpException('Creation Failed', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, memberDto: UpdateMemberDto) {
    // nickname 중복 check
    const member = await this.getOneByNick(memberDto.nickName);
    if (member && member.intraId != id) {
      throw new ForbiddenException('Nickname Already Exist');
    }
    //update의 리턴을 받아서 처리해야할까?
    await this.prisma.member.update({
      where: { intraId: id },
      data: memberDto,
    });
    return HttpStatusCode.Ok;
  }

  async delete(id: string) {
    try {
      const member = await this.getOne(id);
      // console.log(member);
      if (member) {
        await this.prisma.member.delete({
          where: { intraId: id },
        });
        return HttpStatus.OK;
      } else {
      }
    } catch (error) {
      throw new HttpException(
        'Failed to delete member.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getCurrentHashedRefreshToken(refreshToken: string) {
    // 토큰 값을 그대로 저장하기 보단, 암호화를 거쳐 데이터베이스에 저장한다.
    // bcrypt는 단방향 해시 함수이므로 암호화된 값으로 원래 문자열을 유추할 수 없다.
    // const saltOrRounds = 10;
    // const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    // return currentRefreshToken;
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
    const currentRefreshToken = refreshToken;
    //await this.getCurrentHashedRefreshToken(  refreshToken,);
    const currentRefreshTokenExp = await this.getCurrentRefreshTokenExp();
    await this.prisma.member.update({
      where: { intraId: intraId },
      data: {
        currentRefreshToken: currentRefreshToken,
        currentRefreshTokenExp: currentRefreshTokenExp,
      } as Prisma.MemberUpdateInput,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, intraId: string) {
    const member = await this.getOne(intraId);

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
