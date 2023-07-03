import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { MemberIdDto } from './dto/member-id.dto';
import { MessageDto } from './dto/message.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth
} from '@nestjs/swagger';

@Controller('channel')
@ApiTags('Channel API')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // jwt auth 추가 ex @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @Post('/create')
  @ApiOperation({ summary: '채널 생성', description: 'Create Channel API' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청'})
  @ApiResponse({ status: 404, description: '멤버 아님'})
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiCreatedResponse({ type: CreateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Patch(':idx')
  @ApiOperation({ summary: '채널 수정', description: 'Update Channel API' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  update(@Param('idx') idx: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+idx, updateChannelDto);
  }

  @Delete(':idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: '채널 삭제', description: 'Delete Channel API' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  delete(@Param('idx') idx: string) {
    return this.channelService.delete(+idx);
  }

  @Get('/all')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({
    summary: '모든 채널 조회',
    description: 'Find All Channel API',
  })
  findChannelAll() {
    return this.channelService.findChannelAll();
  }
  @Get('dm/all')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({
    summary: '모든 DM 채널 조회',
    description: 'Find DM Channel API',
  })
  findDMAll() {
    return this.channelService.findDMAll();
  }

  @Get(':idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: 'idx 로 한 채널 가져오기',
    description: 'Find channel By Idx API',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  @ApiCreatedResponse({ type: UpdateChannelDto })
  findOneById(@Param('idx') idx: string) {
    return this.channelService.findOneById(+idx);
  }

  @Get('/get/:name')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: '채널이름으로 한 채널 가져오기',
    description: 'Find channel By Name',
  })
  @ApiParam({ name: 'name', example: 'channel', description: 'Channnel name'})
  @ApiCreatedResponse({ type: UpdateChannelDto })
  findOneByName(@Param('name') name: string) {
    return this.channelService.findOneByName(name);
  }

  @Get('/name/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: 'idx 로 채널 이름 가져오기',
    description: 'Get channel name By Idx API',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelName(@Param('idx') idx: string) {
    return this.channelService.getChannelName(+idx);
  }

  @Get('/user_cnt/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: 'idx 로 채널 인원 가져오기',
    description: 'Get channel user count By Idx API',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelUserCnt(@Param('idx') idx: string) {
    return this.channelService.getChannelUserCnt(+idx);
  }

  @Post('/check/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널 password 확인', description: 'Password check By Idx' })
  @ApiBody({ type: CreateChannelDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  checkPassword(@Param('idx') idx: string, @Body() updateChannelDto : UpdateChannelDto) {
    return this.channelService.checkPassword(+idx, updateChannelDto);
  }

  @Post('/oper/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널의 operator 인지 확인', description: 'Is operator' })
  @ApiBody({ type: MemberIdDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  isOperator(@Param('idx') idx: string, @Body() memberIdDto: MemberIdDto) {
    return this.channelService.isOperator(+idx, memberIdDto);
  }

  @Post('/dm/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널이 dm 방인지 확인', description: 'Is DM Channel' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  isDM(@Param('idx') idx: string) {
    return this.channelService.isDM(+idx);
  }

  // channel users

  @Post('/enter/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 403, description: '밴 유저' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널에 들어가기', description: 'Enter channel By Idx' })
  @ApiBody({ type: MemberIdDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  enterChannel(@Body() memberIdDto: MemberIdDto, @Param('idx') idx: string) {
    return this.channelService.enter(+idx, memberIdDto);
  }

  @Post('/leave/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널에서 나오기', description: 'Leave channel By Idx' })
  @ApiBody({ type: MemberIdDto })
  leaveChannel(@Body() memberIdDto: MemberIdDto, @Param('idx') idx: string) {
    return this.channelService.leave(+idx, memberIdDto);
  }

  @Get('/users/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널 유저들 가져오기', description: 'Channel Users By Idx' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelUsers(@Param('idx') idx: string) {
    return this.channelService.getChannelUsers(+idx);
  }

  @Get('/all/:intraId')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'intraId 의 모든 채널 가져오기', description: 'Get all channel By intraId' })
  @ApiParam({ name: 'intraId', example: 'heeskim', description: 'intraid'})
  getChannels(@Param('intraId') intraId: string) {
    return this.channelService.getChannels(intraId);
  }

  @Get('/dm/all/:intraId')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'intraId 의 모든 채널 가져오기', description: 'Get all channel By intraId' })
  @ApiParam({ name: 'intraId', example: 'heeskim', description: 'intraid'})
  getDMChannels(@Param('intraId') intraId: string) {
    return this.channelService.getDMChannels(intraId);
  }
  
  // ban

  @Post('/ban/save/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널에 밴 유저 등록하기', description: 'Save ban user'})
  @ApiBody({ type: MemberIdDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channel Idx' })
  saveBanUser(@Body() memberIdDto: MemberIdDto, @Param('idx') idx:string) {
    return this.channelService.saveBanUser(+idx, memberIdDto);
  }

  @Post('/ban/delete/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널에서 밴 유저 삭제하기', description: 'Delete ban user' })
  @ApiBody({ type: MemberIdDto })
  deleteBanUser(@Body() memberIdDto: MemberIdDto, @Param('idx') idx: string) {
    return this.channelService.deleteBanUser(+idx, memberIdDto);
  }

  @Get('/ban/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널 밴당한 유저들 가져오기', description: 'Get ban user list' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channel Idx' })
  getChannelBanUsers(@Param('idx') idx: string) {
    return this.channelService.getChannelBanUsers(+idx);
  }

  // message

  @Post('/message/send/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널에 메세지 보내기', description: 'Send message' })
  @ApiBody({ type: MessageDto })
  sendMessage(@Param('idx') idx: string, @Body() messageDto: MessageDto) {
    return this.channelService.sendMessage(+idx, messageDto);
  }

  @Get('/message/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널의 메세지 리스트', description: 'Get message list' })
  getMessageList(@Param('idx') idx: string) {
    return this.channelService.getMessageList(+idx);
  }

  @Delete('/message/delete/:idx')
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({ summary: 'idx 채널의 메세지 리스트 리셋하기', description: 'Delete message list' })
  deleteMessageList(@Param('idx') idx: string) {
    return this.channelService.deleteMessageList(+idx);
  }

}
