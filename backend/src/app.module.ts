import { Module, OnModuleInit } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { GameModule } from './game/game.module';
import { ChannelModule } from './channel/channel.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail.module';
import { MemberService } from './member/member.service';
import { SocketIOModule } from './socketio.module';

@Module({
  imports: [
    SocketIOModule,
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
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly memberService: MemberService) {}

  async onModuleInit(): Promise<void> {
    await this.memberService.createAdminMember();
  }
}
