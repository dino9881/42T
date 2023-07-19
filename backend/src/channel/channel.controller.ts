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
import { GetMember } from 'src/util/decorator/getMember.decorator';
import { MemberInfoDto } from 'src/member/dto/member-info.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiResponse({ status: 200, description: '성공' })
@ApiResponse({ status: 404, description: '없는 채널 번호 or 없는 유저' })
@ApiResponse({ status: 500, description: '서버 에러' })
@ApiUnauthorizedResponse({ description: 'Accesstoken 인증 실패' })
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @ApiTags('Channel')
  @Patch(':idx')
  @ApiOperation({
    summary: '채널 패스워드 수정',
    description: 'Update Channel Password API',
  })
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  updatePwd(
    @Param('idx') idx: string,
    @GetMember() member: MemberInfoDto,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.updatePwd(
      +idx,
      member.intraId,
      updateChannelDto,
    );
  }

  @ApiTags('Channel')
  @Patch('update/nick')
  @ApiOperation({
    summary: '모든 닉네임 업데이트',
    description: 'Update NickName API',
  })
  updateNickName(
    @GetMember() member: MemberInfoDto,
  ) {
    this.channelService.updateNickName(
      member.intraId,
      member.nickName,
    );
  }

  @ApiTags('Channel')
  @Delete(':idx')
  @ApiOperation({ summary: '채널 삭제', description: 'Delete Channel API' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  delete(@Param('idx') idx: string) {
    this.channelService.delete(+idx);
  }

  @ApiTags('Channel')
  @Get('/all')
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({
    summary: '모든 일반 채널 조회',
    description: 'Find All Public Channel API',
  })
  findChannelAll() {
    return this.channelService.findChannelAll();
  }

  @ApiTags('Channel')
  @Get(':idx')
  @ApiOperation({
    summary: 'idx 로 한 채널 가져오기',
    description: 'Find channel By Idx API',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  findOneById(@Param('idx') idx: string) {
    return this.channelService.findOneById(+idx);
  }

  @ApiTags('Channel')
  @Get('/get/:name')
  @ApiOperation({
    summary: '채널이름으로 한 채널 가져오기',
    description: 'Find channel By Name',
  })
  @ApiParam({ name: 'name', example: 'channel', description: 'Channnel Name' })
  @ApiCreatedResponse({ type: UpdateChannelDto })
  findOneByName(@Param('name') name: string) {
    return this.channelService.findOneByName(name);
  }

  @ApiTags('Channel')
  @Get('/name/:idx')
  @ApiOperation({
    summary: 'idx 로 채널 이름 가져오기',
    description: 'Get channel name By Idx API',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  getChannelName(@Param('idx') idx: string) {
    return this.channelService.getChannelName(+idx);
  }

  @ApiTags('Channel')
  @Get('/user_cnt/:idx')
  @ApiOperation({
    summary: 'idx 로 채널 인원 가져오기',
    description: 'Get channel user count By Idx API',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  getChannelUserCnt(@Param('idx') idx: string) {
    return this.channelService.getChannelUserCnt(+idx);
  }

  @ApiTags('Channel')
  @Post('/check/:idx')
  @ApiOperation({
    summary: 'idx 채널 password 확인',
    description: 'Password check By Idx',
  })
  @ApiBody({ type: UpdateChannelDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  checkPassword(
    @Param('idx') idx: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelService.checkPassword(+idx, updateChannelDto);
  }

  // channel users

  @ApiTags('Channel User')
  @Get('/my/all')
  @ApiOperation({
    summary: '나의 모든 채널 가져오기',
    description: 'Get my all channel',
  })
  getChannels(@GetMember() member: MemberInfoDto) {
    return this.channelService.getChannels(member.intraId);
  }

  @ApiTags('Channel User')
  @Post('/enter/:idx')
  @ApiResponse({ status: 403, description: '밴 유저 or max' })
  @ApiOperation({
    summary: 'idx 채널에 들어가기',
    description: 'Enter channel By Idx',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  enterChannel(@GetMember() member: MemberInfoDto, @Param('idx') idx: string) {
    return this.channelService.enter(+idx, member);
  }

  @ApiTags('Channel User')
  @Get('/users/:idx')
  @ApiOperation({
    summary: 'idx 채널 유저들 가져오기',
    description: 'Channel Users By Idx',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  getChannelUsers(
    @Param('idx') idx: string,
    @GetMember() member: MemberInfoDto,
  ) {
    return this.channelService.getChannelUsers(+idx, member);
  }

  @ApiTags('Channel User')
  @Get('/isChan/:idx')
  @ApiOperation({
    summary: '내가 idx 채널 유저인지 확인하기',
    description: 'Is Channels User By Idx',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  isChanUser(
    @Param('idx') idx: string,
    @GetMember() member: MemberInfoDto,
  ) {
    return this.channelService.isChanUser(+idx, member.intraId);
  }

  @ApiTags('Channel User')
  @Post('/author/:idx')
  @ApiOperation({
    summary: 'idx 채널 setting 권한 인지 확인',
    description: 'Authorized',
  })
  @ApiBody({ type: MemberInfoDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  isAuthor(@GetMember() member: MemberInfoDto, @Param('idx') idx: string) {
    return this.channelService.isAuthor(+idx, member.intraId);
  }

  @ApiTags('Channel User')
  @Post('/oper/:idx')
  @ApiOperation({
    summary: 'idx 채널의 owner 인지 확인',
    description: 'Is owner',
  })
  @ApiBody({ type: MemberInfoDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  isOwner(@GetMember() member: MemberInfoDto, @Param('idx') idx: string) {
    return this.channelService.isOwner(+idx, member.intraId);
  }

  @ApiTags('Channel User')
  @Post('/admin/:idx')
  @ApiOperation({
    summary: 'idx 채널의 administrator 인지 확인',
    description: 'Is administrator',
  })
  @ApiBody({ type: MemberInfoDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  isAdmin(@GetMember() member: MemberInfoDto, @Param('idx') idx: string) {
    return this.channelService.isAdmin(+idx, member.intraId);
  }

  // ban

  @ApiTags('Channel User')
  @Get('/ban/:idx')
  @ApiOperation({
    summary: 'idx 채널 밴당한 유저들 가져오기',
    description: 'Get ban user list',
  })
  @ApiParam({ name: 'idx', example: '3', description: 'Channel Idx' })
  getChannelBanUsers(@Param('idx') idx: string) {
    return this.channelService.getChannelBanUsers(+idx);
  }

  // message

  @ApiTags('Channel User')
  @Get('/message/:idx')
  @ApiOperation({
    summary: 'idx 채널의 메세지 리스트',
    description: 'Get message list',
  })
  getMessageList(
    @Param('idx') idx: string,
    @GetMember() member: MemberInfoDto,
  ) {
    return this.channelService.getMessageList(+idx, member);
  }

  // DM

  @ApiTags('Channel DM')
  @Get('/my/dm')
  @ApiOperation({
    summary: '나의 모든 DM 채널 가져오기',
    description: 'Get my all DM channel',
  })
  getMyDMChannels(@GetMember() member: MemberInfoDto) {
    return this.channelService.getMyDMChannels(member.intraId);
  }

  @ApiTags('Channel DM')
  @Post('/enter/dm/chan')
  @ApiOperation({ summary: 'DM 채널 생성', description: 'Create Channel API' })
  @ApiCreatedResponse({ type: CreateChannelDto })
  @ApiBody({ type: ChannelUserDto })
  enterDM(
    @GetMember() member: MemberInfoDto,
    @Body() channelUserDto: ChannelUserDto,
  ) {
    return this.channelService.enterDM(member, channelUserDto);
  }

  @ApiTags('Channel DM')
  @Get('dm/all')
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({
    summary: '모든 DM 채널 조회',
    description: 'Find DM Channel API',
  })
  findDMAll() {
    return this.channelService.findDMAll();
  }

  // private

  @ApiTags('Channel Private')
  @Get('/my/private')
  @ApiOperation({
    summary: '나의 모든 Private 채널 가져오기',
    description: 'Get my all Pravate channel',
  })
  getMyPrivateChannels(@GetMember() member: MemberInfoDto) {
    return this.channelService.getMyPrivateChannels(member.intraId);
  }

  @ApiTags('Channel Private')
  @Post('/create')
  @ApiOperation({ summary: 'private 채널 생성할 때 사용', description: 'Create Channel' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiCreatedResponse({ type: CreateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  create(
    @GetMember() member: MemberInfoDto,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelService.create(member, createChannelDto);
  }

  @ApiTags('Channel Private')
  @Get('private/')
  @ApiCreatedResponse({ type: UpdateChannelDto })
  @ApiOperation({
    summary: '모든 Private 채널 조회',
    description: 'Find Private Channel API',
  })
  findPrivateChannelAll() {
    return this.channelService.findPrivateChannelAll();
  }

  @ApiTags('Channel Private')
  @Get('private/:idx')
  @ApiOperation({
    summary: 'idx 채널이 private 채널 인지 조회',
    description: 'Is Private',
  })@ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx' })
  isPrivate(@Param('idx') idx: string) {
    return this.channelService.isPrivate(+idx);
  }

}
