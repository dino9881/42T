import {
  BadRequestException,
  ConsoleLogger,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { HttpStatusCode } from 'axios';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const members = this.prisma.member.findMany();
    if (members) {
      return members;
    } else {
      throw new NotFoundException('Member Table is empty');
    }
  }

  async getOne(intraId: string) {
    console.log(intraId);
    try {
      const member = await this.prisma.member.findUnique({
        where: { intraId },
      });
      if (member === null) {
        throw new NotFoundException('Member Not Found');
      }
      // console.log(member);
      return member;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async getOneByNick(nick: string) {
    console.log(nick);
    try {
      const member = await this.prisma.member.findUnique({
        where: { nickName: nick },
      });
      // console.log(member);
      return member;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  async create(memberDto: CreateMemberDto) {
    //멤버의 인자가 맞지 않을 경우 처리필요
    try {
      //이미 같은 intraid / nickname의 member 존재하는지 체크해줘야함 'Intraid is Already Exist'
      const result = await this.prisma.member.create({ data: memberDto });
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      //멤버 테이블에 저장을 실패했을 경우 > 언제가 있을까?
    }
  }

  async update(id: string, memberDto: UpdateMemberDto) {
    // nickname 중복 check
    const member = await this.getOneByNick(memberDto.nickName);
    if (member && member.intraId != id) {
      throw new ForbiddenException('Nickname Already Exist');
    }
    return this.prisma.member.update({
      where: { intraId: id },
      data: memberDto,
    });
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
}
