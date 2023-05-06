import { Controller,Query, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { createDto } from './user.createDto';

@Controller('name')
export class UserController {
    constructor(private readonly userService: UserService) {}
@Post()
  getName(@Body() body : createDto) :string {
    console.log("body");
    console.log(body);
    return this.userService.getHello(body);
  }
@Get()
  getNameById(@Query('id') id: number) : Promise<string>{
    console.log("id" + id);
    return this.userService.getNameById(id);
  }
}
