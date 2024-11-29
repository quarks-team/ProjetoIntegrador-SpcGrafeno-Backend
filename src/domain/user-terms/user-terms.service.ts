import { Injectable } from '@nestjs/common';
import { UserTerms } from './user-terms.entity';
import { AcceptanceTermService } from '../acceptance-terms/service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AcceptanceTerms } from '../user/user.entity';

@Injectable()
export class UserTermsService {
  constructor(
    private acceptanceTermsService: AcceptanceTermService,
    private userService: UserService,
    @InjectModel('UserTerms') private readonly userTermsModel: Model<UserTerms>,
  ) { }

  async createUserTerms(
    userId: string,
    acceptanceTerms: Partial<AcceptanceTerms>,
    revoked?: boolean,
  ): Promise<void> {
    const userTerms: UserTerms = {
      _id: new ObjectId(),
      userId: userId,
      terms: acceptanceTerms[0] as AcceptanceTerms,
      isActive: revoked ? false : true,
      version: acceptanceTerms.version,
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
  
    const filteredRecords = response.filter(record => record.updatedAt);
  
    const sortedRecords = filteredRecords.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  
    return sortedRecords;
  }

}