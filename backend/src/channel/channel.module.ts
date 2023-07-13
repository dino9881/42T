import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MemberService } from 'src/member/member.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService, MemberService],
  exports: [ChannelService],
})
export class ChannelModule {}
