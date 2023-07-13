import { Module, forwardRef } from '@nestjs/common';
import { SocketIOGateway } from './socketio.gateway';
import { MemberModule } from './member/member.module';
import { ChannelModule } from './channel/channel.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    forwardRef(() => MemberModule),
    forwardRef(() => GameModule),
    forwardRef(() => ChannelModule),
  ],
  providers: [SocketIOGateway, Map],
  exports: [SocketIOGateway],
})
export class SocketIOModule {}
