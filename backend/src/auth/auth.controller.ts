import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { MemberService } from 'src/member/member.service';
import { RefreshTokenDto } from './refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private memberService: MemberService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(signInDto);
    const member = await this.authService.validateMember(signInDto.intraId);
    const access_token = await this.authService.generateAccessToken(member);
    const refresh_token = await this.authService.generateRefreshToken(member);
    await this.memberService.setCurrentRefreshToken(
      refresh_token,
      member.intraId,
    );
    res.setHeader('Authorization', 'Bearer ' + [access_token]);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      path: '/',
      domain: 'localhost',
      maxAge: 60 * 60 * 24 * 7, // week
    });
    res.status(200).json({
      message: 'login success',
      access_token: access_token,
    });
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Body() body) {
  //   return body.intraId;
  // }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      console.log('auth controller - refresh - req.cookies');
      console.log(req.cookies);
      const newAccessToken = await this.authService.refresh(refreshToken);
      console.log('auth controller - refresh - new Access Token');
      console.log(newAccessToken);
      res.setHeader('Authorization', 'Bearer' + newAccessToken);
      res.status(200).json({
        message: 'refresh success',
        access_token: newAccessToken,
      });
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
