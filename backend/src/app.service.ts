import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(public readonly config: ConfigService) {}
  public async getIntraAccessToken(code) {
    const getTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const body = {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.config.get('CLIENT_ID'),
      client_secret: this.config.get('CLIENT_SECRET'),
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
    // console.log(data);
    console.log("appservice - getintraAccesstoken");
    console.log(data.login);
  }
}
