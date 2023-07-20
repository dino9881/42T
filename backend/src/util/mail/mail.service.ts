import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(intraId: string, code: number) {
    this.mailerService
      .sendMail({
        to: `${intraId}@student.42seoul.kr`,
        from: {
          name: '42T',
          address: 'noreply@gmail.com',
        },
        subject: 'Testing Nest MailerModule ✔',
        text: 'welcome to 42T',
        html: `<b>Hello User, this is you code. ${code}</b>`,
      })
      .then(() => {
        console.log('mail-send code : ' + code);
        // console.log(result);
        return;
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error);
      });
  }
}
