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
      // Ensure `fakeScoreData` includes all fields with non-null constraints
      const fakeScoreData = {
        endorserName,
        finalScore: Math.floor(Math.random() * 100), // Random score for testing
        inputVariables: {}, // Provide an empty JSON object or test data
        cnpj: null,         // Set to null if not required, as it's nullable in the schema
        createdTimestamp: new Date(), // This can be omitted if using the default timestamp
      };

      // Only include known properties to avoid errors
      const fakeScore = this.endorserScoreRepository.create(fakeScoreData);
      await this.endorserScoreRepository.save(fakeScore);

      // Fetch the score based on endorser name
      return await this.endorserScoreRepository.find({
        where: { endorserName },
      });
    } catch (error) {
      console.error(`Error fetching score for endorser '${endorserName}':`, error);
      throw new Error("An error occurred while fetching the endorser's score.");
    }
  }

  async getAllScores(): Promise<EndorserScore[]> {
    try {
      return await this.endorserScoreRepository.find();
    } catch (error) {
      console.error("Error fetching scores:", error);  // Log the error
      throw new Error("An error occurred while fetching scores.");  // Re-throw the error
    }
  }
}
