import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
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
  @Post('/login')
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
    res.setHeader('Authorization', 'Bearer ' + [access_token, refresh_token]);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
    });
    return {
      message: 'login success',
      access_token: access_token,
      // refresh_token: refresh_token,
    };
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // getProfile(@Body() body) {
  //   return body.intraId;
  // }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const newAccessToken = (await this.authService.refresh(refreshTokenDto))
        .accessToken;
      res.setHeader('Authorization', 'Bearer' + newAccessToken);
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
}
