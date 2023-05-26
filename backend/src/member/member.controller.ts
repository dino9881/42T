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

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('create')
  create(@Body() memberDto: CreateMemberDto) {
    return this.memberService.create(memberDto);
  }

  @Delete('delete')
  delete(@Body('id') id: string) {
    return this.memberService.delete(id);
  }

  @Get('all')
  getMemberAll() {
    console.log('getmemberall called');
    return this.memberService.getAll();
  }

  @Get(':id')
  getMemberDetail(@Param('id') id: string) {
    console.log(id);
    return this.memberService.getOne(id);
  }

  @Get('rank')
  getMemberRank(@Param('id') id: string) {
    // return this.memberService.getOne(id);
  }

  @Get('nick')
  getMemberNick(@Param('id') id: string) {
    // return this.memberService.getOne(id);
  }

  @Get('avatar')
  getMemberAvatar(@Param('id') id: string) {
    // return this.memberService.getOne(id);
  }

  @Patch('update/:id')
  updateMember(@Param('id') id: string, @Body() member: UpdateMemberDto) {
    return this.memberService.update(id, member);
  }
}
