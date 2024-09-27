import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { UserPolicy } from './user-policy.entity';
import { PolicyService } from '../policy/policy.service';

@Processor('user-created')
@Injectable()
export class UserConsumer extends WorkerHost {
  userPolicyRepository: Repository<UserPolicy>;
  constructor(
    @InjectRepository(UserPolicy)
    private userPoliciesRepo: Repository<UserPolicy>,
    private policyService: PolicyService,
  ) {
    super();
    this.userPolicyRepository = this.userPoliciesRepo;
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const policies = await this.policyService.getAll();

    const userPolicies = policies.map((policy) => {
      return {
        userId: job.data.userId,
        policyId: policy.id,
        isActive: false,
      } as unknown as UserPolicy;
    });

    await this.userPolicyRepository
      .createQueryBuilder()
      .insert()
      .into(UserPolicy)
      .values(userPolicies)
      .execute();
  }
}
