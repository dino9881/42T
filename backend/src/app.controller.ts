import { Controller, Get, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    ) {}

  @Get()
  getHello(): string {
    console.log("get Hello");
    return this.appService.getHello();
  }

}
