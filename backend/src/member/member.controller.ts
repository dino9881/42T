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
import { HttpStatusCode } from 'axios';

@ApiTags('member')
@ApiResponse({
  status: 500,
  description: '서버 에러',
})
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '멤버생성' })
  @ApiResponse({
    status: HttpStatusCode.Created,
    description: '생성 완료',
  })
  @ApiResponse({
    status: HttpStatusCode.Conflict,
    description: '멤버 닉네임 / 인트라 아이디 중복',
  })
  @ApiBody({ type: CreateMemberDto })
  @Post('create')
  create(@Body() memberDto: CreateMemberDto) {
    console.log(memberDto);
    return this.memberService.create(memberDto);
  }

  @ApiOperation({ summary: '멤버삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공'})
  @ApiResponse({ status: 404, description: '삭제할 멤버를 찾지 못함'})
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

  @ApiOperation({ summary: '멤버정보 찾기' })
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: '성공',
    type: CreateMemberDto,
  })
  @ApiResponse({
    status: 404,
    description: '삭제할 멤버를 찾지 못함',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '인트라아이디',
  })
  getMemberDetail(@Param('id') id: string) {
    return this.memberService.getOne(id);
  }

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
}
