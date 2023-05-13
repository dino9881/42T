import { Controller, Get, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import {User as UserModel} from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    ) {}

  @Get()
  getHello(): string {
    console.log("get Hello");
    return this.appService.getHello();
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string},
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get('name')
  async getName(@Query('id') id: string): Promise<string> {
    const user = await this.userService.user({ id: Number(id) });
    if (user) {
      return user.name;
    } else {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
