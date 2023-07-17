import { registerAs } from '@nestjs/config';

export default registerAs('ft', () => ({
  clientId: process.env.FT_CLIENT_ID,
  clientSecret: process.env.FT_CLIENT_SECRET,
  callBack: process.env.FT_CALLBACK,
}));
