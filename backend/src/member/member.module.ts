import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MailService } from '../util/mail/mail.service';

@Module({
  imports: [],
  controllers: [MemberController],
  providers: [MemberService, MailService],
  exports: [MemberService],
})
export class MemberModule {}
