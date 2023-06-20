import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MemberModule } from './member/member.module';
import { GameModule } from './game/game.module';
import { ChannelModule } from './channel/channel.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SocketIOGateway } from './socketio.gateway';

@Module({
  imports: [
    MemberModule,
    ChannelModule,
    GameModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    AuthModule,
  ],
  providers: [PrismaService, SocketIOGateway],
})
export class AppModule {}
