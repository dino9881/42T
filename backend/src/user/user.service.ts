import { Injectable } from '@nestjs/common';
import { createDto } from './user.createDto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository, FindOneOptions } from 'typeorm';
// import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,){}

    getHello(body : createDto): string {
        console.log(body);
        const user = new User();
        user.name = body.name;
        this.userRepository.save(user);
        return 'Hello User!';
      }
    
    async getNameById(id :number) : Promise<string> {
        const options: FindOneOptions<User> = { where: {id: id} };
        const data = await this.userRepository.findOne(options);
        console.log(data);
        return data.name;
    }
}
