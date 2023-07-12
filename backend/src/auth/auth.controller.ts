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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetMember } from 'src/decorator/getMember.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Member } from '@prisma/client';

@ApiTags('Auth')
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
  @ApiCreatedResponse({ description: '인증 성공' })
  @ApiUnauthorizedResponse({ description: 'intra 인증실패' })
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
    return this.authService.getIntraAccessToken(code);
  }

  @ApiOperation({ summary: '로그인시 access & refresh token 발급' })
  @ApiBody({
    schema: {
      properties: {
        intraId: { example: 'heeskim', type: 'string' },
      },
    },
    required: true,
    description: '인트라아이디',
  })
  @ApiOkResponse({
    description: 'access token & refresh token 발급 성공',
    schema: {
      properties: {
        message: { example: 'login success', type: 'string' },
        access_token: { example: 'access-token', type: 'string' },
      },
    },
    headers: {
      'Set-Cookie': {
        description: 'Add refresh token to Cookie header',
        schema: {
          type: 'string',
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @Post('login')
  async signIn(
    @Body('intraId') intraId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const member = await this.memberService.getOne(intraId);
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
      maxAge: 60 * 60 * 24 * 7 * 1000, // week
    });
    res.status(200).json({
      message: 'login success',
      access_token: access_token,
      refresh_token: refresh_token,
    });
  }

  @ApiOperation({ summary: 'refresh token으로 access token재발급' })
  @ApiOkResponse({
    schema: {
      properties: {
        message: { example: 'refresh success', type: 'string' },
        access_token: { example: 'access-token', type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'refresh token이 유효하지 않음' })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @ApiCookieAuth('refresh_token')
  @ApiBadRequestResponse({ description: 'invalid user called refresh' })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const refreshToken = req.cookies['refresh_token'];
      if (refreshToken === undefined)
        throw new UnauthorizedException('Invalid refresh-token');
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

  @ApiOperation({ summary: 'access token 인증 후 내 정보 가져오기' })
  @ApiOkResponse({ description: '내 정보 가져오기 성공' })
  @ApiUnauthorizedResponse({ description: 'access token이 유효하지 않음' })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyInfo(@GetMember() member: Member) {
    // console.log(member);
    return member;
  }
}
