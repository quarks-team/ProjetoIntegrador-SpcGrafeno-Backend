import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { UserTermsService } from './user-terms.service';

@Processor('policy-created')
@Injectable()
export class PolicyConsumer extends WorkerHost {
  constructor(private userTermsService: UserTermsService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    await this.userTermsService.createPolicyForAllUsers(job.data.policyId);
  }
}
