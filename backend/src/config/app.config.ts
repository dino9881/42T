import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.HOST,
  redirectUrl: process.env.REDIRECT_URL,
  frontPort: parseInt(process.env.FRONT_PORT, 10),
  backPort: parseInt(process.env.BACK_PORT, 10),
  frontUrl: process.env.FRONT_URL,
  backUrl: process.env.BACK_URL,
  cookeSecret: process.env.COOKIE_SECRET,
}));
