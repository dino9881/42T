import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
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

@ApiTags('member')
@ApiResponse({
  status: 500,
  description: '서버 에러',
})
@ApiUnauthorizedResponse({ description: 'Accesstoken 인증 실패' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

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
    console.log(memberDto);
    return this.memberService.create(memberDto);
  }

  @ApiOperation({ summary: 'intraId로 멤버삭제' })
  @ApiOkResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '삭제할 멤버를 찾지 못함' })
  @Delete('delete')
  @ApiBody({
    schema: {
      properties: {
        id: { example: 'heeskim', type: 'string' },
      },
    },
    required: true,
    description: '인트라아이디',
  })
  delete(@Body('id') id: string) {
    return this.memberService.delete(id);
  }

  @ApiOperation({ summary: '전 멤버정보 찾기' })
  @ApiOkResponse({ description: '성공', type: CreateMemberDto, isArray: true })
  @Get('all')
  getMemberAll() {
    return this.memberService.getAll();
  }

  @ApiOperation({ summary: 'intraId로 멤버정보 찾기' })
  @ApiOkResponse({
    description: '성공',
    type: CreateMemberDto,
  })
  @ApiNotFoundResponse({ description: '멤버를 찾지 못함' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  @Get(':id')
  getMemberDetail(@Param('id') id: string) {
    return this.memberService.getOne(id);
  }

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

  @ApiTags('friend')
  @ApiOperation({ summary: '친구 추가' })
  @ApiParam({
    name: 'nickName',
    required: true,
    description: '친구로 등록할 멤버 닉네임',
  })
  @ApiOkResponse({ description: '친구 추가 성공' })
  @ApiConflictResponse({ description: '이미 친구로 등록된 멤버' })
  @ApiNotFoundResponse({ description: '친구로 등록한 멤버를 찾지 못함' })
  @Post('friend/add')
  addFriend(
    @GetMember() member: MemberInfoDto,
    @Param('nickName') nickName: string,
  ) {
    return this.memberService.addFriend(member, nickName);
  }

  @ApiTags('friend')
  @ApiOperation({ summary: '친구 목록' })
  @ApiOkResponse({ description: '성공', type: MemberInfoDto, isArray: true })
  @Get('friend/list')
  getFriendList(@GetMember() member: MemberInfoDto) {
    return this.memberService.getFriendList(member);
  }

  @ApiTags('friend')
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

  @ApiTags('ban')
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

  @ApiTags('ban')
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
