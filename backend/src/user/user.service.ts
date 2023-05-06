import { Injectable } from '@nestjs/common';
import { createDto } from './user.createDto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,){}
    getHello(body : createDto): string {
        this.userRepository.save(body);
        return 'Hello User!';
      }
}
