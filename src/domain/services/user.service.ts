import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entites/user';

@Injectable()
export class UserService {
  repository: Repository<User>;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.repository = userRepository;
  }

  async getHello(): Promise<User[]> {
    return await this.repository.find();
  }
}
