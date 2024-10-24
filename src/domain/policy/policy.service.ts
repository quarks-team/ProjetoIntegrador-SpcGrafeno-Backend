import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from './policy.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PolicyService {
  repository: Repository<Policy>;
  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
    @InjectQueue('policy-created') private userCreatedQueue: Queue,
  ) {
    this.repository = this.policyRepository;
  }

  async create(policy: Policy): Promise<Policy> {
    policy = await this.repository.save(policy);
    await this.userCreatedQueue.add('policy-created', { policyId: policy.id });
    return policy;
  }

  async update(policy: Policy): Promise<Policy> {
    return this.repository.save(policy);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.repository.update(
      {
        id,
      },
      {
        excludedAt: new Date(),
      },
    );
  }

  async getById(id: number): Promise<Policy> {
    return this.repository.findOne(id);
  }

  async getAll(): Promise<Policy[]> {
    return this.repository.find({
      where: {
        excludedAt: null,
      },
    });
  }
}
