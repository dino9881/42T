import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { MemberIdDto } from './dto/member-id.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@Controller('channel')
@ApiTags('Channel API')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/create')
  @ApiOperation({ summary: '채널 생성', description: 'Create Channel API' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiCreatedResponse({ type: CreateChannelDto })
  @ApiBody({ type: CreateChannelDto })
  create(@Body() createChannelDto: CreateChannelDto) {
    console.log(createChannelDto);
    return this.channelService.create(createChannelDto);
  }

  @Patch(':idx')
  @ApiOperation({ summary: '채널 수정', description: 'Update Channel API' })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 409, description: '중복 이름' })
  @ApiResponse({ status: 500, description: '서버 에러' })
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
  @ApiOperation({
    summary: '모든 채널 조회',
    description: 'Find All Channel API',
  })
  findAll() {
    return this.channelService.findAll();
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
  findOneById(@Param('idx') idx: string) {
    return this.channelService.findOneById(+idx);
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

  // getChannelUser

  @Post('/enter/:idx')
  @ApiOperation({ summary: 'idx 채널에 들어가기', description: 'Enter channel By Idx' })
  @ApiBody({ type: MemberIdDto })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  enterChannel(@Body() memberIdDto: MemberIdDto, @Param('idx') idx: string) {
    this.channelService.enter(+idx, memberIdDto);
  }

  @Post('/leave/:idx')
  @ApiOperation({ summary: 'idx 채널에서 나오기', description: 'Leave channel By Idx' })
  @ApiBody({ type: MemberIdDto })
  leaveChannel(@Body() memberIdDto: MemberIdDto, @Param('idx') idx: string) {
    this.channelService.leave(+idx, memberIdDto);
  }

  @Get('/users/:idx')
  @ApiOperation({ summary: 'idx 채널 유저들 가져오기', description: 'channel Users By Idx' })
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelUsers(@Param('idx') idx: string) {
    this.channelService.getChannelUsers(+idx);
  }
}
