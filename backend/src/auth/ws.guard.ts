import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class WsGuard implements CanActivate {
  jwtService: any;
  constructor(
    private memberService: MemberService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(bearerToken, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return new Promise((resolve, reject) => {
        return this.memberService.getOne(decoded.intraId).then((member) => {
          if (member) {
            resolve(member);
          } else {
            reject(false);
          }
        });
      });
    } catch (exception) {
      console.log(exception);
      return false;
    }
  }
}
