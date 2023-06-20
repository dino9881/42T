// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     // const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//     //   context.getHandler(),
//     //   context.getClass(),
//     // ]);
//     // if (isPublic) {
//     //   // 💡 See this condition
//     //   return true;
//     // }
//     //public으로 접근가능한 api를 어떻게 연결할건지?/
//     //refresh token은 어떻게 주지?
//     // console.log('context');
//     // console.log(context);
//     const request = context.switchToHttp().getRequest();
//     const access_token = this.extractTokenFromHeader(request);
//     if (!access_token) {
//       return true;
//       // throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(access_token, {
//         secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
//       });
//     } catch (err) {
//       // local storage에 저장된 jwt token값을 삭제하고 들어오면 여기서 에러발생
//       // 평소에는 여기 걸려서 error발생되는게 맞는데,
//       // refresh에 대해서는 error 체킹을 안해야됨.
//       // 일단 여기를 return true; 로변경
//       // throw new UnauthorizedException();
//       return true;
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
