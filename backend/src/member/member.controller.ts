import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { Response, Request } from 'express';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetMember } from 'src/decorator/getMember.decorator';
import { MemberInfoDto } from './dto/member-info.dto';
import { Public } from 'src/decorator/public.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { HttpStatusCode } from 'axios';
import { MailService } from '../mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Multer from 'multer';

@ApiResponse({
  status: 500,
  description: '서버 에러',
})
@ApiUnauthorizedResponse({ description: 'Accesstoken 인증 실패' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly mailerService: MailService,
  ) {}

  @ApiTags('Two-Factor-Autentication')
  @ApiOperation({ summary: '2차 인증 코드 생성 및 메일 전송' })
  @ApiOkResponse({ description: '메일 전송 성공' })
  @Get('mail/send')
  async sendMail(@GetMember() member: MemberInfoDto, @Res() res: Response) {
    const code = await this.memberService.generateTFACode();
    this.mailerService.sendMail(member.intraId, code);
    res.cookie('code', code, {
      httpOnly: true,
      path: '/',
      domain: 'localhost',
      maxAge: 5 * 60 * 1000, // 5min
      signed: true,
    });
    res.end();
  }

  @ApiTags('Two-Factor-Autentication')
  @ApiOperation({ summary: '2차 인증 코드 검증' })
  @ApiCreatedResponse({ description: '코드 검증 성공' })
  @ApiBadRequestResponse({ description: '코드 검증 실패' })
  @ApiBody({
    schema: {
      properties: {
        code: { type: 'string' },
      },
    },
    required: true,
    description: '2차 인증 코드',
  })
  @Post('mail/verify')
  async verifyTFACode(@Req() req: Request, @Body('code') code: string) {
    return this.memberService.verifyTFACode(req, code);
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '새로운 멤버 생성' })
  @ApiCreatedResponse({
    description: '생성 완료',
  })
  @ApiConflictResponse({
    description: '멤버 닉네임 / 인트라 아이디 중복',
  })
  @ApiBody({ type: CreateMemberDto })
  @Public()
  @Post('create')
  create(@Body() memberDto: CreateMemberDto) {
    return this.memberService.create(memberDto);
  }

  @ApiTags('Member')
  @ApiOperation({ summary: 'intraId로 멤버인지 아닌지 확인' })
  @ApiOkResponse({ description: '멤버가 존재함' })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @Public()
  @Get('check/:intraId')
  async checkMember(@Param('intraId') intraId: string) {
    const member = await this.memberService.getOne(intraId);
    if (member) return HttpStatusCode.Ok;
  }

  @ApiTags('Member')
  @ApiOperation({ summary: 'intraId로 멤버삭제' })
  @ApiOkResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '삭제할 멤버를 찾지 못함' })
  @Public()
  @Delete('delete')
  @ApiBody({
    schema: {
      properties: {
        intraId: { example: 'heeskim', type: 'string' },
      },
    },
    required: true,
    description: '인트라아이디',
  })
  delete(@Body('intraId') intraId: string) {
    return this.memberService.delete(intraId);
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '전 멤버정보 찾기' })
  @ApiOkResponse({ description: '성공', type: MemberInfoDto, isArray: true })
  @Public()
  @Get('all')
  getMemberAll() {
    return this.memberService.getAll();
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '랭크 큰거부터 7명의 멤버 정보 불러오기' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      properties: {
        length: { example: 7, type: 'number' },
        data: { example: ['MemberInfo'], type: 'array' },
      },
    },
  })
  @Get('rank')
  getRank() {
    return this.memberService.getSevenRanks();
  }

  @ApiTags('Member')
  @ApiOperation({ summary: 'intraId로 멤버정보 찾기' })
  @ApiOkResponse({
    description: '성공',
    type: MemberInfoDto,
  })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @ApiParam({
    name: 'intraId',
    required: true,
    description: '인트라아이디',
  })
  @Get(':intraId')
  getMemberDetail(@Param('intraId') intraId: string) {
    return this.memberService.getOne(intraId);
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '멤버 닉네임 변경' })
  @ApiOkResponse({ description: '성공' })
  @ApiConflictResponse({ description: '닉네임 중복값 존재' })
  @ApiBody({ type: UpdateMemberDto })
  @Patch('update/nick')
  updateMemberNick(
    @GetMember() member: MemberInfoDto,
    @Body() updateDto: UpdateMemberDto,
  ) {
    return this.memberService.updateNick(member, updateDto);
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '멤버 아바타 변경' })
  @ApiOkResponse({ description: '성공' })
  @ApiBody({ type: UpdateMemberDto })
  @Patch('update/avatar')
  updateMemberAvatar(
    @GetMember() member: MemberInfoDto,
    @Body() updateinfo: UpdateMemberDto,
  ) {
    return this.memberService.updateAvatar(member, updateinfo);
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '멤버 아바타 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '성공' })
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  uploadMemberAvatar(
    @GetMember() member: MemberInfoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    if (!file) {
      throw new BadRequestException("file doesn't exist");
    }
    return this.memberService.updateAvatar(member, { avatar: file.path });
    // 파일 정보를 데이터베이스에 저장하거나 다른 로직을 수행할 수 있습니다.
  }

  @ApiTags('Member')
  @ApiOperation({ summary: '멤버 검색' })
  @ApiParam({
    name: 'nickName',
    required: true,
    description: '검색할 멤버 닉네임',
  })
  @ApiOkResponse({ description: '성공', type: MemberInfoDto })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @Get('search/:nickName')
  searchMember(
    @GetMember() member: MemberInfoDto,
    @Param('nickName') nickName: string,
  ) {
    return this.memberService.searchMember(member, nickName);
  }

  @ApiTags('Friend')
  @ApiOperation({ summary: '친구 목록' })
  @ApiOkResponse({ description: '성공', type: MemberInfoDto, isArray: true })
  @Get('friend/list')
  getFriendList(@GetMember() member: MemberInfoDto) {
    return this.memberService.getFriendList(member);
  }

  @ApiTags('Friend')
  @ApiOperation({ summary: '친구 추가' })
  @ApiParam({
    name: 'nickName',
    type: 'string',
    required: true,
    description: '친구로 등록할 멤버 닉네임',
  })
  @ApiCreatedResponse({ description: '친구 추가 성공' })
  @ApiConflictResponse({ description: '이미 친구로 등록된 멤버' })
  @ApiNotFoundResponse({ description: '친구로 등록할 멤버를 찾지 못함' })
  @Post('friend/add/:nickName')
  addFriend(
    @GetMember() member: MemberInfoDto,
    @Param('nickName') nickName: string,
  ) {
    return this.memberService.addFriend(member, nickName);
  }

  @ApiTags('Friend')
  @ApiOperation({ summary: '친구 삭제' })
  @ApiParam({
    name: 'nickName',
    required: true,
    description: '친구에서 삭제할 멤버 닉네임',
  })
  @ApiOkResponse({ description: '친구 삭제 성공' })
  @ApiNotFoundResponse({
    description: '친구삭제할 멤버를 찾지 못함, 혹은 친구가 아님',
  })
  @Delete('friend/delete/:nickName')
  deleteFriend(
    @GetMember() member: MemberInfoDto,
    @Param('nickName') nickName: string,
  ) {
    return this.memberService.deleteFriend(member, nickName);
  }

  @ApiTags('Ban')
  @ApiOperation({ summary: '차단 멤버 목록' })
  @ApiCreatedResponse({
    description: '차단 성공',
    type: MemberInfoDto,
    isArray: true,
  })
  @Get('ban/list')
  getBanList(@GetMember() member: MemberInfoDto) {
    return this.memberService.getBanList(member);
  }

  @ApiTags('Ban')
  @ApiOperation({ summary: 'test' })
  @ApiParam({ name: 'intraId' })
  @Post('ban/:intraId')
  dmBanMember(
    @GetMember() member: MemberInfoDto,
    @Param('intraId') intraId: string,
  ) {
    return this.memberService.isDMBan(member.intraId, intraId);
  }

  @ApiTags('Ban')
  @ApiOperation({ summary: '멤버 차단' })
  @ApiParam({
    name: 'nickName',
    required: true,
    description: '차단할 멤버 닉네임',
  })
  @ApiOkResponse({ description: '차단 성공' })
  @ApiConflictResponse({ description: '이미 차단된 멤버' })
  @ApiNotFoundResponse({ description: '차단할 멤버를 찾지 못함' })
  @Post('ban/:nickName')
  banMember(
    @GetMember() member: MemberInfoDto,
    @Param('nickName') nickName: string,
  ) {
    return this.memberService.banMember(member, nickName);
  }

  @ApiTags('Ban')
  @ApiOperation({ summary: '멤버 차단 해제' })
  @ApiParam({
    name: 'nickName',
    required: true,
    description: '차단 해제할 멤버 닉네임',
  })
  @ApiNotFoundResponse({
    description: '차단해제할 멤버를 찾지 못함 혹은 차단되어 있지 않음',
  })
  @ApiOkResponse({ description: '차단 해제 성공' })
  @Delete('unban/:nickName')
  unbanMember(
    @GetMember() member: MemberInfoDto,
    @Param('nickName') nickName: string,
  ) {
    return this.memberService.unbanMember(member, nickName);
  }
}
