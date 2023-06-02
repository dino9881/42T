import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';
import { Member } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenDto } from './refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
    public readonly config: ConfigService,
  ) {}

  async validateMember(intraId: string): Promise<any> {
    const member = await this.memberService.getOne(intraId);
    return member;
    // if (!member) {
    //   throw new NotFoundException('Member Not Found');
    // } //이미 getOne에서 돌려주는듯
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // const { password, ...result } = user;
    // // TODO: Generate a JWT and return it here
    // // instead of the user object
    // return result;
    // const payload = { id: member.intraId };
    // if (!(await bcrypt.compare(loginDto.password, user.password))) {
    //   throw new BadRequestException('Invalid credentials!');
    // }
    // return { access_token: await this.jwtService.signAsync(payload) };
  }

  async generateAccessToken(member: Member): Promise<string> {
    const payload = {
      intraId: member.intraId,
    };
    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(member: Member): Promise<string> {
    const payload = {
      intraId: member.intraId,
    };
    return await this.jwtService.signAsync(
      { intraId: payload.intraId },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
      },
    );
  }

  async refresh(refreshToken: string) {
    // Verify refresh token
    // JWT Refresh Token 검증 로직
    console.log('auth service - refresh here');
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });
    console.log('auth service - refresh decoded refreshtoken');
    console.log(decodedRefreshToken);

    // Check if user exists
    const intraId = decodedRefreshToken.intraId;
    const member = await this.memberService.getMemberIfRefreshTokenMatches(
      refreshToken,
      intraId,
    );
    if (!member) {
      throw new UnauthorizedException('Invalid user!');
    }

    // Generate new access token
    const accessToken = await this.generateAccessToken(member);

    return { accessToken };
  }
}
