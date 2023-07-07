import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
