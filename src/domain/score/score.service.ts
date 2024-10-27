import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndorserScore } from './endorser-score.entity';
import { tryCatch } from 'bullmq';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(EndorserScore)
    private readonly endorserScoreRepository: Repository<EndorserScore>,
  ) { }

  async getScore(endorserName: string): Promise<EndorserScore[]> {
    try {
      return await this.endorserScoreRepository.find({
        where: { endorserName },
      });
    } catch (error) {
      console.error(`Error selecting the score for endorser '${endorserName}':`, error);
      throw new Error("An error occurred while selecting endorser score.");
    }
  }

  async getAllScores(): Promise<EndorserScore[]> {
    try {
      return await this.endorserScoreRepository.find();
    } catch (error) {
      console.error("Error fetching scores:", error);
      throw new Error("An error occurred while fetching scores.");
    }
  }
}
