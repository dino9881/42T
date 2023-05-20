import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('create')
  create(@Body() memberDto: CreateMemberDto) {
    return this.memberService.create(memberDto);
  }

  @Post('delete')
  delete(@Body() id: string) {
    return this.memberService.delete(id);
  }

  @Get('')
  getMemberDetail(@Param('id') id: string) {
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

  @Patch('update')
  updateMember(@Body() member: UpdateMemberDto) {
    // return this.memberService.update(member);
  }
}
