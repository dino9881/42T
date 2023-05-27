import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth')
  @ApiResponse({
    status: 500,
    description: 'server error',
  })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  recieveCode(@Body('code') code: string) {
    console.log(code);
    this.appService.getIntraAccessToken(code);
  }
}
