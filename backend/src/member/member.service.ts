import { Injectable, NotFoundException } from '@nestjs/common';
import { Member, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getMany(): Promise<Member[]> {
    return this.prisma.member.findMany();
  }

  async getOne(intraId: string): Promise<string> {
    const member = await this.prisma.member.findUnique({
      where: { intraId },
    });

    if (member) {
      return member.nickName;
    } else {
      throw new NotFoundException('Member not found');
    }
  }

  async create(data: Prisma.MemberCreateInput): Promise<Member> {
    return this.prisma.member.create({ data });
  }

  async update(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
    return this.prisma.member.update({ where: { intraId: id }, data });
  }

  async delete(id: string): Promise<Member> {
    return this.prisma.member.delete({ where: { intraId: id } });
  }

  // throwBadRequestException(msg?: any): BadRequestException {
  //   throw new Error('Method not implemented.');
  // }
  // throwNotFoundException(name: string): NotFoundException {
  //   throw new Error('Method not implemented.');
  // }
}
