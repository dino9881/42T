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

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('create')
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Get('all')
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }

  @Post('enter:id')
  enterChannel(@Body() intraId: string, @Param('id') id: string) {
    // return this.channelService.enter(id, intraId);
  }

  @Post('leave:id')
  leaveChannel(@Body() intraId: string, @Param('id') id: string) {
    //return this.channelService.leave(id, intraId);
  }
}
