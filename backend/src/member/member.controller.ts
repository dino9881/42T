import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberDto } from './dto/member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('create')
  create(@Body() memberDto: MemberDto) {
    return this.memberService.create(memberDto);
  }

  @Post('delete')
  delete(@Body() id: string) {
    return this.memberService.delete(id);
  }

  @Get('')
  getOneNick(@Param('id') id: string) {
    return this.memberService.getOne(id);
  }
}
