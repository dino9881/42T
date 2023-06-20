import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from 'src/member/member.service';

@Module({
  controllers: [GameController],
  providers: [GameService, PrismaService, MemberService],
})
export class GameModule {}
