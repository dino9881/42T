import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  public async getIntraAccessToken(code) {
    const getTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const body = {
      grant_type: 'authorization_code',
      code: code,
      client_id:
        'u-s4t2ud-5f6c11deaba7c5820c30f06b7944c9c1267194355db1c971c9e54b90563b7c5c',
      client_secret:
        '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',
      redirect_uri: 'http://localhost:3000/login',
    };
    const response: AxiosResponse = await axios.post(getTokenUrl, body);
    if (response.data.error) {
      throw new HttpException('intra 인증 실패', 401);
    }
    const { access_token } = response.data;
    console.log(access_token);

    const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    // if (data.data.error) {
    //   throw new HttpException('intra 인증 실패', 401);
    // }
    console.log(data);
    console.log(data.login);
  }
}
