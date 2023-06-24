import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { MemberService } from 'src/member/member.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMember } from 'src/decorator/getMember.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Member } from '@prisma/client';

@ApiTags('auth')
@ApiResponse({
  status: 500,
  description: '서버 에러',
})
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private memberService: MemberService,
  ) {}

  @ApiOperation({ summary: '42intra인증 코드 전송' })
  @Post('code')
  @ApiResponse({
    status: 201,
    description: '인증 성공',
  })
  @ApiResponse({
    status: 401,
    description: 'intra 인증실패',
  })
  @ApiBody({
    schema: {
      properties: {
        code: { example: 'intra-code', type: 'string' },
      },
    },
    required: true,
    description: 'intra code',
  })
  recieveCode(@Body('code') code: string) {
    console.log(code);
    return this.authService.getIntraAccessToken(code);
  }

  @ApiOperation({ summary: '로그인시 access & refresh token 발급' })
  // @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() loginDto: Record<string, any>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const member = await this.memberService.getOne(loginDto.intraId);
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

  @ApiOperation({ summary: 'refresh token으로 access token재발급' })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      const newAccessToken = await this.authService.refresh(refreshToken);
      res.setHeader('Authorization', 'Bearer' + newAccessToken);
      res.status(200).json({
        message: 'refresh success',
        access_token: newAccessToken,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyInfo(@GetMember() member: Member) {
    console.log(member);
    return member;
  }
}
