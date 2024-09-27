import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndorserScore } from './endorser-score.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(EndorserScore)
    private readonly endorserScoreRepository: Repository<EndorserScore>,
  ) {}

  async getScore(cnpj: string): Promise<EndorserScore[]> {
    const fakeScore = await this.endorserScoreRepository.save({
      cnpj,
      active: 2,
      canceled: 1,
      finished: 3,
      score: Math.floor(Math.random() * 100), // Random score between 0 and 99
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.endorserScoreRepository.save(fakeScore);
    return await this.endorserScoreRepository.find({
      where: {
        cnpj,
      },
    });
  }
}
