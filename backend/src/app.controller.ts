import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth')
  recieveCode(@Body('code') code: string) {
    console.log(code);
    this.appService.getIntraAccessToken(code);
  }
}
