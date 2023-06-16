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
<<<<<<< HEAD
=======
import { MemberIdDto } from './dto/member-id.dto';
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiResponse,
<<<<<<< HEAD
=======
  ApiBody,
  ApiParam,
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f
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
<<<<<<< HEAD
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
=======
  @ApiBody({ type: CreateChannelDto })
  update(@Param('idx') idx: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+idx, updateChannelDto);
  }

  @Delete(':idx')
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f
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

<<<<<<< HEAD
  @Get(':id')
=======
  @Get(':idx')
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: 'idx 로 한 채널 가져오기',
    description: 'Find channel By Idx API',
  })
<<<<<<< HEAD
  findOneById(@Param('id') id: string) {
    return this.channelService.findOneById(+id);
  }

  @Get('/name/:id')
=======
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  findOneById(@Param('idx') idx: string) {
    return this.channelService.findOneById(+idx);
  }

  @Get('/name/:idx')
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: 'idx 로 채널 이름 가져오기',
    description: 'Get channel name By Idx API',
  })
<<<<<<< HEAD
  getChannelName(@Param('id') id: string) {
    return this.channelService.getChannelName(+id);
  }

  @Get('/user_cnt/:id')
=======
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelName(@Param('idx') idx: string) {
    return this.channelService.getChannelName(+idx);
  }

  @Get('/user_cnt/:idx')
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 404, description: '없는 채널 번호' })
  @ApiResponse({ status: 500, description: '서버 에러' })
  @ApiOperation({
    summary: 'idx 로 채널 인원 가져오기',
    description: 'Get channel user count By Idx API',
  })
<<<<<<< HEAD
  getChannelUserCnt(@Param('id') id: string) {
    return this.channelService.getChannelUserCnt(+id);
  }

  // @Post('/enter/:id')
  // @ApiOperation({ summary: 'idx 채널에 들어가기', description: 'Enter channel By Idx API' })
  // enterChannel(@Body() intraId: string, @Param('id') id: string) {
  //   this.channelService.enter(+id, intraId);
  // }
=======
  @ApiParam({ name: 'idx', example: '3', description: 'Channnel Idx'})
  getChannelUserCnt(@Param('idx') idx: string) {
    return this.channelService.getChannelUserCnt(+idx);
  }

  // getChannelUser
>>>>>>> cc30c00137afaaceb5c1eafb756723cd79e60b4f

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
