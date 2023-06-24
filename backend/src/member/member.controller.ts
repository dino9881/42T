import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('member')
@ApiResponse({
  status: 500,
  description: '서버 에러',
})
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
    // console.log(id);
    return this.memberService.getOne(id);
  }

  @ApiOperation({ summary: '멤버 닉네임 변경' })
  @ApiOkResponse({ description: '성공' })
  @ApiConflictResponse({ description: '닉네임 중복값 존재' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  @Patch('update/nick/:id')
  @ApiBody({ type: UpdateMemberDto })
  updateMemberNick(@Param('id') id: string, @Body() member: UpdateMemberDto) {
    return this.memberService.updateNick(id, member);
  }

  @ApiOperation({ summary: '멤버 아바타 변경' })
  @ApiOkResponse({ description: '성공' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  @ApiBody({ type: UpdateMemberDto })
  @Patch('update/avatar/:id')
  updateMemberAvatar(@Param('id') id: string, @Body() member: UpdateMemberDto) {
    return this.memberService.updateAvatar(id, member);
  }

  // 추가해야할 기능
  // 친구 찾기
  // 친구 추가
  // 친구 삭제
  // 차단
}
