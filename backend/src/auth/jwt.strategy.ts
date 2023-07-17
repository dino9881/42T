import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Member } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import jwtConfig from 'src/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // true로 하고 authguard에서 검증하면 메세지를 포함한 exception을 던질 수 있음
      secretOrKey: jwt.accessSecret,
    });
  }

  async validate(payload: { intraId: string }): Promise<Member> {
    const member = await this.prisma.member.findUnique({
      where: { intraId: payload.intraId },
    });
    if (!member) {
      throw new UnauthorizedException('member not found');
    }
    return member;
  }
}
