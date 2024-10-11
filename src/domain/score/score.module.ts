import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EndorserScore } from './endorser-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EndorserScore])],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
