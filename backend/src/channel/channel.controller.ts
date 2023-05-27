import { Controller, Get, Post, Body, Patch, Param, Delete, } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiResponse} from '@nestjs/swagger';

@Controller('channel')
@ApiTags('Channel API')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('/create')
  @ApiOperation({ summary: '채널 생성', description: 'Create Channel API' })
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 409, description: "중복 이름"})
  @ApiResponse({status: 500, description: "서버 에러"})
  @ApiCreatedResponse({ type: CreateChannelDto })
  create(@Body() createChannelDto: CreateChannelDto) {
    console.log(createChannelDto);
    return this.channelService.create(createChannelDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '채널 수정', description: 'Update Channel API' })
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 404, description: "없는 채널 번호"})
  @ApiResponse({status: 409, description: "중복 이름"})
  @ApiResponse({status: 500, description: "서버 에러"})
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 404, description: "없는 채널 번호"})
  @ApiResponse({status: 500, description: "서버 에러"})
  @ApiOperation({ summary: '채널 삭제', description: 'Delete Channel API' })
  delete(@Param('id') id: string) {
    return this.channelService.delete(+id);
  }

  @Get('/all')
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 404, description: "없는 채널 번호"})
  @ApiResponse({status: 500, description: "서버 에러"})
  @ApiOperation({ summary: '모든 채널 조회', description: 'Find All Channel API' })
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 404, description: "없는 채널 번호"})
  @ApiResponse({status: 500, description: "서버 에러"})
  @ApiOperation({ summary: 'idx 로 한 채널 가져오기', description: 'Find channel By Idx API' })
  findOneById(@Param('id') id: string) {
    return this.channelService.findOneById(+id);
  }

  @Get('/name/:id')
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 404, description: "없는 채널 번호"})
  @ApiResponse({status: 500, description: "서버 에러"})
  @ApiOperation({ summary: 'idx 로 채널 이름 가져오기', description: 'Get channel name By Idx API' })
  getChannelName(@Param('id') id: string) {
    return this.channelService.getChannelName(+id);
  }

  @Get('/user_cnt/:id')
  @ApiResponse({status: 200, description: "성공"})
  @ApiResponse({status: 404, description: "없는 채널 번호"})
  @ApiResponse({status: 500, description: "서버 에러"})
  @ApiOperation({ summary: 'idx 로 채널 인원 가져오기', description: 'Get channel user count By Idx API' })
  getChannelUserCnt(@Param('id') id: string) {
    return this.channelService.getChannelUserCnt(+id);
  }

  
  // @Post('/enter/:id')
  // @ApiOperation({ summary: 'idx 채널에 들어가기', description: 'Enter channel By Idx API' })
  // enterChannel(@Body() intraId: string, @Param('id') id: string) {
  //   this.channelService.enter(+id, intraId);
  // }

  // @Post('leave:id')
  // @ApiOperation({ summary: 'idx 채널에서 나오기', description: 'Leave channel By Idx API' })
  // leaveChannel(@Body() intraId: string, @Param('id') id: string) {
  //   this.channelService.leave(+id, intraId);
  // }
}
