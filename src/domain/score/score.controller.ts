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
  constructor(private readonly scoreService: ScoreService) {}

  @Get(':cnpj')
  @ApiOperation({ summary: 'Get user score' })
  @ApiResponse({
    status: 200,
    description: 'The user score',
    type: EndorserScore,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getScore(@Param('cnpj') cnpj: string) {
    try {
      const score = await this.scoreService.getScore(cnpj);
      return { score };
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
