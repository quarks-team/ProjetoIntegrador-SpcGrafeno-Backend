import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entites/user';
import { Storage } from '../../infra/storage/storage';
import * as fs from 'fs';
import { Stream } from 'stream';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  repository: Repository<User>;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private storage: Storage,
  ) {
    this.repository = userRepository;
  }

  async getHello(): Promise<User[]> {
    return await this.repository.find();
  }

  async create(user: User): Promise<User> {
    user.password = await hash(user.password, 10);
    return await this.repository.save(user);
  }

  async update(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async delete(userId: string): Promise<DeleteResult> {
    let deletedList: Stream;
    try {
      deletedList = await this.storage.getObject('badListId');
    } catch (e) {
      console.log('Error fetching badListId', e);
    }
    if (!deletedList) {
      fs.writeFileSync('deletedList', JSON.stringify([userId]));
    } else {
      const deletedListData = await new Promise<string>((resolve, reject) => {
        let data = '';
        deletedList.on('data', (chunk) => (data += chunk));
        deletedList.on('end', () => resolve(data));
        deletedList.on('error', (err) => reject(err));
      });

      const deletedListArray = JSON.parse(deletedListData);
      deletedListArray.push(userId);
      fs.writeFileSync('deletedList', JSON.stringify(deletedListArray));
    }
    await this.storage.putObject({
      name: 'badListId',
      path: './deletedList',
    });
    return await this.repository.delete(userId);
  }
}
