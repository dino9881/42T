import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { MemberService } from 'src/member/member.service';

@Module({
  controllers: [GameController],
  providers: [GameService, MemberService],
  exports: [GameService],
})
export class GameModule {}
