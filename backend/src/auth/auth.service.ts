import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private memberService: MemberService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string): Promise<any> {
    const member = await this.memberService.getOne(username);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // const { password, ...result } = user;
    // // TODO: Generate a JWT and return it here
    // // instead of the user object
    // return result;
    const payload = { id: member.intraId };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
