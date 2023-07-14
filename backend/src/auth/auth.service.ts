import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';
import { Member } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    public readonly config: ConfigService,
  ) {}

  public async getIntraAccessToken(code: string): Promise<string> {
    const getTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const body = {
      grant_type: 'authorization_code',
      code: code,
      client_id: this.config.get('CLIENT_ID'),
      client_secret: this.config.get('CLIENT_SECRET'),
      redirect_uri: 'http://localhost:3000/login',
    };
    try {
      const response = await axios.post(getTokenUrl, body);
      const access_token: string = response.data.access_token;
      const { data } = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return data.login;
    } catch (error) {
      throw new UnauthorizedException('intra 인증 실패');
    }
  }

  async generateAccessToken(member: Member) {
    return await this.jwtService.signAsync(
      { intraId: member.intraId },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
      },
    );
  }

  async generateRefreshToken(member: Member) {
    return await this.jwtService.signAsync(
      { intraId: member.intraId },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
      },
    );
  }

  async refresh(refreshToken: string) {
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });
    // user가 존재하는지 체크 (refresh token이 유효한지)
    const intraId: string = decodedRefreshToken.intraId;
    const member = await this.memberService.getMemberIfRefreshTokenMatches(
      refreshToken,
      intraId,
    );
    if (member == null) {
      throw new BadRequestException('Invalid user!');
    }
    // new access token 생성
    const accessToken = await this.generateAccessToken(member);
    return accessToken;
  }
}
