import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessExpire: parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME, 10),
  refreshExpire: parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME, 10),
}));
