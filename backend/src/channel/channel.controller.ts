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
import { ChannelUserDto } from './dto/channel-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetMember } from 'src/decorator/getMember.decorator';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiResponse({ status: 200, description: '성공' })
@ApiResponse({ status: 404, description: '없는 채널 번호' })
@ApiResponse({ status: 500, description: '서버 에러' })
@ApiUnauthorizedResponse({ description: 'Accesstoken 인증 실패' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Channel API')
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/create')
  @ApiOperation({ summary: '채널 생성', description: 'Create Channel API' })
  @ApiResponse({ status: 400, description: '잘못된 요청'})
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiCreatedResponse({ type: CreateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  create(@GetMember() member: MemberInfoDto, @Body() createChannelDto: CreateChannelDto) {
    console.log(member);
    return this.channelService.create(member, createChannelDto);
  }

  @Patch(':idx')
  @ApiOperation({ summary: '채널 수정', description: 'Update Channel API' })
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  update(@Param('idx') idx: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+idx, updateChannelDto);
  }

  @Delete(':idx')
  @ApiOperation({ summary: '채널 삭제', description: 'Delete Channel API' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  delete(@Param('idx') idx: string) {
    this.channelService.delete(+idx);
  }

  @Get('/all')
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({ summary: '모든 채널 조회', description: 'Find All Channel API', })
  findChannelAll() {
    return this.channelService.findChannelAll();
  }
  @Get('dm/all')
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({ summary: '모든 DM 채널 조회', description: 'Find DM Channel API', })
  findDMAll() {
    return this.channelService.findDMAll();
  }

  @Get(':idx')
  @ApiOperation({ summary: 'idx 로 한 채널 가져오기', description: 'Find channel By Idx API', })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  @ApiCreatedResponse({ type: UpdateChannelDto })
  findOneById(@Param('idx') idx: string) {
    return this.channelService.findOneById(+idx);
  }

  @Get('/get/:name')
  @ApiOperation({ summary: '채널이름으로 한 채널 가져오기', description: 'Find channel By Name', })
  @ApiParam({ name: 'name', example: 'channel', description: 'Channnel name'})
  @ApiCreatedResponse({ type: UpdateChannelDto })
  findOneByName(@Param('name') name: string) {
    return this.channelService.findOneByName(name);
  }

  @Get('/name/:idx')
  @ApiOperation({ summary: 'idx 로 채널 이름 가져오기', description: 'Get channel name By Idx API', })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelName(@Param('idx') idx: string) {
    return this.channelService.getChannelName(+idx);
  }

  @Get('/user_cnt/:idx')
  @ApiOperation({ summary: 'idx 로 채널 인원 가져오기', description: 'Get channel user count By Idx API', })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelUserCnt(@Param('idx') idx: string) {
    return this.channelService.getChannelUserCnt(+idx);
  }

  @Post('/check/:idx')
  @ApiOperation({ summary: 'idx 채널 password 확인', description: 'Password check By Idx' })
  @ApiBody({ type: UpdateChannelDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  checkPassword(@Param('idx') idx: string, @Body() updateChannelDto : UpdateChannelDto) {
    return this.channelService.checkPassword(+idx, updateChannelDto);
  }

  @Post('/oper/:idx')
  @ApiOperation({ summary: 'idx 채널의 operator 인지 확인', description: 'Is operator' })
  @ApiBody({ type: MemberInfoDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  isOperator(@Param('idx') idx: string, @GetMember() member: MemberInfoDto) {
    return this.channelService.isOperator(+idx, member.intraId);
  }

  @Post('/dm/:idx')
  @ApiOperation({ summary: 'idx 채널이 dm 방인지 확인', description: 'Is DM Channel' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  isDM(@Param('idx') idx: string) {
    return this.channelService.isDM(+idx);
  }

  // channel users

  @Post('/enter/:idx')
  @ApiResponse({ status: 403, description: '밴 유저 or max' })
  @ApiOperation({ summary: 'idx 채널에 들어가기', description: 'Enter channel By Idx' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  enterChannel(@GetMember() member: MemberInfoDto, @Param('idx') idx: string) {
    return this.channelService.enter(+idx, member);
  }

  @Post('/leave/:idx')
  @ApiOperation({ summary: 'idx 채널에서 나오기', description: 'Leave channel By Idx' })
  leaveChannel(@GetMember() member: MemberInfoDto, @Param('idx') idx: string) {
    return this.channelService.leave(+idx, member.intraId);
  }

  @Post('/kick/:idx')
  @ApiOperation({ summary: 'idx 채널의 user 쫓아내기', description: 'Is operator' })
  @ApiBody({ type: ChannelUserDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  kickChannel(@Body() channelUserDto: ChannelUserDto, @Param('idx') idx: string) {
    return this.channelService.kick(+idx, channelUserDto);
  }

  @Get('/users/:idx')
  @ApiOperation({ summary: 'idx 채널 유저들 가져오기', description: 'Channel Users By Idx' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelUsers(@Param('idx') idx: string, @GetMember() member: MemberInfoDto) {
    return this.channelService.getChannelUsers(+idx, member);
  }

  @Get('/my/all')
  @ApiOperation({ summary: '나의 모든 채널 가져오기', description: 'Get my all channel' })
  getChannels(@GetMember() member: MemberInfoDto) {
    return this.channelService.getChannels(member.intraId);
  }

  // ban

  @Post('/ban/save/:idx')
  @ApiOperation({ summary: 'idx 채널에 밴 유저 등록하기', description: 'Save ban user'})
  @ApiBody({ type: ChannelUserDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channel Idx' })
  saveBanUser(@Body() channelUserDto: ChannelUserDto, @Param('idx') idx:string) {
    return this.channelService.saveBanUser(+idx, channelUserDto);
  }

  @Post('/ban/delete/:idx')
  @ApiOperation({ summary: 'idx 채널에서 밴 유저 삭제하기', description: 'Delete ban user' })
  @ApiBody({ type: ChannelUserDto })
  deleteBanUser(@Body() channelUserDto: ChannelUserDto, @Param('idx') idx: string) {
    return this.channelService.deleteBanUser(+idx, channelUserDto);
  }

  @Get('/ban/:idx')
  @ApiOperation({ summary: 'idx 채널 밴당한 유저들 가져오기', description: 'Get ban user list' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channel Idx' })
  getChannelBanUsers(@Param('idx') idx: string) {
    return this.channelService.getChannelBanUsers(+idx);
  }

  // message

  @Get('/message/:idx')
  @ApiOperation({ summary: 'idx 채널의 메세지 리스트', description: 'Get message list' })
  getMessageList(@Param('idx') idx: string, @GetMember() member:MemberInfoDto) {
    return this.channelService.getMessageList(+idx, member);
  }

  // mute
  @Post('/mute/:idx')
  @ApiOperation({ summary: 'idx 채널의 유저 mute 하기', description: 'Mute user' })
  muteUser(@Param('idx') idx: string, @Body() channelUserDto: ChannelUserDto) {
    this.channelService.muteUser(+idx, channelUserDto);
  }

  // DM

  @Post('/enter/dm/chan')
  @ApiOperation({ summary: 'DM 채널 생성', description: 'Create Channel API' })
  @ApiResponse({ status: 400, description: '잘못된 요청'})
  @ApiCreatedResponse({ type: CreateChannelDto })
  @ApiBody({ type: ChannelUserDto })
  enterDM(@GetMember() member: MemberInfoDto, @Body() channelUserDto: ChannelUserDto) {
    return this.channelService.enterDM(member, channelUserDto);
  }

  @Get('/my/dm')
  @ApiOperation({ summary: '나의 모든 DM 채널 가져오기', description: 'Get my all DM channel' })
  getMyDMChannels(@GetMember() member: MemberInfoDto) {
    return this.channelService.getMyDMChannels(member.intraId);
  }

}
