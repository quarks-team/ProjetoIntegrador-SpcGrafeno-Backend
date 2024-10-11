import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { UserPolicyService } from './user-policy.service';

@Processor('policy-created')
@Injectable()
export class PolicyConsumer extends WorkerHost {
  constructor(private userPolicyService: UserPolicyService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    await this.userPolicyService.createPolicyForAllUsers(job.data.policyId);
  }
}
