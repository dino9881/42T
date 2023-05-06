import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('name')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log("!!1");
    return this.appService.getHello();
  }
  @Post()
  getName(@Body() body) :string {
    console.log(body);
    return "hhhhhh";
  }
}