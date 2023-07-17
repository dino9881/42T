import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  mailUser: process.env.MAIL_USER,
  mailPW: process.env.MAIL_PASSWORD,
  mailHost: process.env.MAIL_HOST,
  mailPort: parseInt(process.env.MAIL_PORT, 10),
  mailFrom: process.env.MAIL_FROM,
}));
