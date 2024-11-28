import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { UserTermsService } from './user-terms.service';

@Processor('user-consent')
@Injectable()
export class UpdateConsentStatusConsumer extends WorkerHost {
  constructor(private userTermsService: UserTermsService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    return await this.userTermsService.createUserTerms(
      job.data.userId,
      job.data.acceptanceTerms,
      job.data.revoked,
    );
  }
}
