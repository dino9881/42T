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
  @ApiResponse({
    status: 201,
    description: '생성 완료',
  })
  @ApiResponse({
    status: 409,
    description: '멤버 닉네임 / 인트라 아이디 중복',
  })
  @ApiBody({ type: CreateMemberDto })
  @Post('create')
  create(@Body() memberDto: CreateMemberDto) {
    console.log(memberDto);
    return this.memberService.create(memberDto);
  }

  @ApiOperation({ summary: 'intraId로 멤버삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '삭제할 멤버를 찾지 못함' })
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
  @ApiResponse({
    status: 200,
    description: '성공',
    type: CreateMemberDto,
    isArray: true,
  })
  @Get('all')
  getMemberAll() {
    return this.memberService.getAll();
  }

  @ApiOperation({ summary: 'intraId로 멤버정보 찾기' })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '성공',
    type: CreateMemberDto,
  })
  @ApiResponse({
    status: 404,
    description: '멤버를 찾지 못함',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  getMemberDetail(@Param('id') id: string) {
    // console.log(id);
    return this.memberService.getOne(id);
  }

  @ApiOperation({ summary: '멤버 닉네임 변경' })
  @Patch('update/nick/:id')
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiResponse({
    status: 409,
    description: '닉네임 중복값 존재',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  @ApiBody({ type: UpdateMemberDto })
  updateMemberNick(@Param('id') id: string, @Body() member: UpdateMemberDto) {
    return this.memberService.updateNick(id, member);
  }

  @ApiOperation({ summary: '멤버 아바타 변경' })
  @Patch('update/avatar/:id')
  @ApiResponse({
    status: 200,
    description: '성공',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  @ApiBody({ type: UpdateMemberDto })
  updateMemberAvatar(@Param('id') id: string, @Body() member: UpdateMemberDto) {
    return this.memberService.updateAvatar(id, member);
  }

  // 추가해야할 기능
  // 친구 찾기
  // 친구 추가
  // 친구 삭제
  // 차단
}
