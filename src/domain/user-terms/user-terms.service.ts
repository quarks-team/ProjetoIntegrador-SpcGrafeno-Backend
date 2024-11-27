import { Injectable } from '@nestjs/common';
import { UserTerms } from './user-terms.entity';
import { AcceptanceTermService } from '../acceptance-terms/service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserTermsService {
  constructor(
    private acceptanceTermsService: AcceptanceTermService,
    private userService: UserService,
    @InjectModel('UserTerms') private readonly userTermsModel: Model<UserTerms>,
  ) {}

  async createUserTerms(userId: string): Promise<void> {
    const terms = await this.acceptanceTermsService.getAll();

    const version = terms.reduce(
      (max, item) => (item.version > max ? item.version : max),
      0,
    );

    const userTerms: UserTerms = {
      userId: userId,
      terms: terms,
      isActive: true,
      version: version,
      acceptanceDate: new Date(),
      updatedAt: new Date(),
    };

    await this.userTermsModel.create(userTerms);
  }

  async invalidateUserTerms(acceptanceTermId: string): Promise<void> {
    const users = await this.userService.getAll();
    const terms = await this.acceptanceTermsService.getById(acceptanceTermId);
    const userTerms = users.map((user) => {
      return {
        _id: new ObjectId(),
        userId: user['_id'],
        terms: terms,
        isActive: false,
      } as unknown as UserTerms;
    });
    await this.userTermsModel.create(userTerms);
    this.userService.InvalidateAcceptanceTermsAllUsers();
  }

  async getUserTermsById(id: string): Promise<UserTerms> {
    return this.userTermsModel.findById(id);
  }

  async getAllUserTerms(): Promise<UserTerms[]> {
    return this.userTermsModel.find();
  }

  async getUserTermsByUserId(userId: string): Promise<any> {
    const response = await this.userTermsModel.find({ userId: userId });
    return response;
  }
}
