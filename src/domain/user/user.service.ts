import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Storage } from '../../infra/storage/storage';
import * as fs from 'fs';
import { Stream } from 'stream';
import { compareSync, hash } from 'bcrypt';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { AcceptanceTerm } from '../acceptance-terms/acceptance-term.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/infra/auth/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectQueue('user-created') private userCreatedQueue: Queue,
    @InjectQueue('user-consent') private userConsentQueue: Queue,
    private storage: Storage,
    private readonly JwtService: JwtService,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getById(userId: string): Promise<User> {
    return await this.userModel.findById(userId);
  }

  async create(user: User): Promise<User> {
    user.password = await hash(user.password, 10);
    user = await this.userModel.create({
      ...user,
      _id: new ObjectId(),
      consentStatus: true,
      consentDate: new Date(),
    });
    this.userCreatedQueue.add('user-created', {
      userId: user._id,
      acceptanceTerms: user.acceptanceTerms,
    });
    return user;
  }

  async login(
    userData: Partial<User>,
  ): Promise<{ user: User; token?: string }> {
    const user = await this.userModel.findOne({
      email: userData.email,
    });
    if (compareSync(userData.password, user.password.toString())) {
      if (user.consentStatus) {
        const token = await this.JwtService.signAsync(user.toJSON(), {
          secret: jwtConstants.secret,
        });
        return { user, token: token };
      }
      return { user };
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async update(user: User): Promise<User> {
    if (user.consentStatus === true) {
      await this.userConsentQueue.add('user-consent', { userId: user._id });
      user.consentDate = new Date();
    }
    return await this.userModel.create(user);
  }

  async acceptanceTerms(
    userId: string,
    acceptanceTerms: Partial<AcceptanceTerm>,
  ): Promise<any> {
    const user = await this.userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        consentStatus: true,
        acceptanceTerms: [acceptanceTerms],
        consentDate: new Date(),
      },
    );
    await this.userConsentQueue.add('user-consent', {
      userId: userId,
      acceptanceTerms: acceptanceTerms,
    });
    return user;
  }

  async revokeTerms(userId: string): Promise<any> {
    await this.userModel.updateOne(
      { _id: new ObjectId(userId) },
      {
        consentStatus: false,
        consentDate: null,
      },
    );
    const user = await this.userModel.findById(new ObjectId(userId));
    await this.userConsentQueue.add('user-consent', {
      userId: userId,
      acceptanceTerms: user.acceptanceTerms,
      revoked: true,
    });
    return user;
  }

  async delete(userId: string): Promise<any> {
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
    return await this.userModel.deleteOne({ _id: new ObjectId(userId) });
  }

  async deleteUsersBadList() {
    let deletedList: Stream;
    try {
      deletedList = await this.storage.getObject('badListId');
    } catch (e) {
      console.log('Error fetching badListId', e);
    }
    if (!deletedList) {
      return;
    } else {
      const deletedListData = await new Promise<string>((resolve, reject) => {
        let data = '';
        deletedList.on('data', (chunk) => (data += chunk));
        deletedList.on('end', () => resolve(data));
        deletedList.on('error', (err) => reject(err));
      });

      const deletedListArray: [] = JSON.parse(deletedListData);
      const objectIds = deletedListArray.map((item) => new ObjectId(item));

      return await this.userModel.deleteMany({
        _id: { $in: objectIds },
      });
    }
  }

  async InvalidateAcceptanceTermsAllUsers(): Promise<void> {
    await this.userModel.updateMany(
      {},
      { consentStatus: false, consentDate: null },
    );
  }
}
