import { Injectable } from '@nestjs/common';
import { AcceptanceTerm } from './acceptance-term.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class AcceptanceTermService {
  constructor(
    @InjectModel('AcceptanceTerm')
    private readonly acceptanceTermModel: Model<AcceptanceTerm>,
    @InjectQueue('acceptanceTerm-created') private userCreatedQueue: Queue,
  ) {}

  async create(acceptanceTerm: AcceptanceTerm): Promise<AcceptanceTerm> {
    await this.acceptanceTermModel.updateMany(
      {},
      {
        isActive: false,
      },
    );
    acceptanceTerm = await this.acceptanceTermModel.create({
      ...acceptanceTerm,
      _id: new ObjectId(),
    });
    await this.userCreatedQueue.add('acceptanceTerm-created', {
      acceptanceTermId: acceptanceTerm['_id'],
    });
    return acceptanceTerm;
  }

  async update(acceptanceTerm: AcceptanceTerm): Promise<AcceptanceTerm> {
    return this.acceptanceTermModel.create(acceptanceTerm);
  }

  async delete(id: number): Promise<any> {
    return this.acceptanceTermModel.updateOne(
      {
        id,
      },
      {
        excludedAt: new Date(),
      },
    );
  }

  async getById(_id: string): Promise<AcceptanceTerm> {
    return this.acceptanceTermModel.findOne({
      _id: new ObjectId(_id),
    });
  }

  async getAll(): Promise<AcceptanceTerm[]> {
    return this.acceptanceTermModel.find({
      isActive: true,
    });
  }
}
