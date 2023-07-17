import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MailModule } from 'src/util/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';

@Module({
  imports: [MailModule, ConfigModule.forFeature(jwtConfig)],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
