import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EndorserScore } from './endorser-score.entity';
import { ScoreService } from './score.service';

@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) { }

  @Get(':endorser')
  @ApiOperation({ summary: 'Get user score by endorser - name' })
  @ApiResponse({
    status: 200,
    description: 'The user score',
    type: EndorserScore,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getScore(@Param('endorser') endorserName: string) {
    try {
      const score = await this.scoreService.getScore(endorserName);
      return { score };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users scores' })
  @ApiResponse({
    status: 200,
    description: 'List from all users scores',
    type: EndorserScore,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllScores() {
    try {
      const scores = await this.scoreService.getAllScores();
      return { scores };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
