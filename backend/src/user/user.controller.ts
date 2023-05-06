import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { createDto } from './user.createDto';
@Controller('name')
export class UserController {
    constructor(private readonly userService: UserService) {}
@Post()
  getName(@Body() body : createDto) :string {
    console.log(body);
    return this.userService.getHello(body);
  }
}
