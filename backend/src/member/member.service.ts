import {
  BadRequestException,
  ConsoleLogger,
  ConflictException,
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
      throw new NotFoundException('member/all failed');
    }
  }

  async getOne(intraId: string) {
    const member = await this.prisma.member.findUnique({
      where: { intraId },
    });
    if (member === null) {
      throw new NotFoundException('Member Not Found by IntraId');
    }
    return member;
  }

  async getOneByNick(nick: string) {
    const member = await this.prisma.member.findUnique({
      where: { nickName: nick },
    });
    return member;
  }

  async create(memberDto: CreateMemberDto) {
    const nickMemeber = await this.getOneByNick(memberDto.nickName);
    if (nickMemeber) {
      throw new ConflictException('Nickname Already Exist');
    }
    try {
      await this.prisma.member.create({ data: memberDto });
      return HttpStatus.CREATED;
    } catch (err){
        throw new ConflictException('Member Already Exist');
    }
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
        throw new NotFoundException('Member Not Found');
      }
    } catch (error) {
      throw new HttpException(
        'Failed to delete member.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
