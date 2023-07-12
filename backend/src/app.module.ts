import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { GameModule } from './game/game.module';
import { ChannelModule } from './channel/channel.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SocketIOGateway } from './socketio.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail.module';
import { Socket } from 'socket.io';

@Module({
  imports: [
    AuthModule,
    ChannelModule,
    GameModule,
    MemberModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MailModule,
  ],
  providers: [
    SocketIOGateway,
    {
      provide: Map,
      useValue: new Map<string, Socket>(),
    },
  ],
})
export class AppModule {}
