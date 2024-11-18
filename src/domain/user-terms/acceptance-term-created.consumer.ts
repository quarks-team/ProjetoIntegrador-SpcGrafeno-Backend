import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { UserTermsService } from './user-terms.service';

@Processor('acceptanceTerm-created')
@Injectable()
export class AcceptanceTerm extends WorkerHost {
  constructor(private userTermsService: UserTermsService) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    await this.userTermsService.invalidateUserTerms(job.data.acceptanceTermId);
  }
}
