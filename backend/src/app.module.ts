import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { MemberModule } from './member/member.module';
import { GameModule } from './game/game.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [MemberModule, ChannelModule, GameModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
