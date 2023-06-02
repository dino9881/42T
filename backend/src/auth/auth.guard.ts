import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    // if (isPublic) {
    //   // 💡 See this condition
    //   return true;
    // }
    //public으로 접근가능한 api를 어떻게 연결할건지?/
    //refresh token은 어떻게 주지?
    // console.log('context');
    // console.log(context);
    const request = context.switchToHttp().getRequest();
    const access_token = this.extractTokenFromHeader(request);
    console.log('canActivate - access token');
    console.log(access_token);
    if (!access_token) {
      return true;
        // throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      console.log('canActivate - payload');
      console.log(payload);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
