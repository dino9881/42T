import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [MemberModule],
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
