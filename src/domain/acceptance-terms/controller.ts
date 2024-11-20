import {
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { AcceptanceTerm } from 'src/domain/acceptance-terms/acceptance-term.entity';
import { DeleteResult } from 'typeorm';
import { AcceptanceTermService } from './service';
import { AuthGuard } from 'src/infra/auth/auth.guard';

const AcceptanceTermsSchema = {
  value: {
    version: 1,
    isActive: true,
    description: 'AcceptanceTerm description',
    items: [
      {
        name: 'padrão',
        description: 'boa',
        tag: 'EMAIL-COMMUNICATION',
        isMandatory: false,
      },
      {
        name: 'mandatória',
        description: 'boa pa nois',
        tag: 'DATA-USAGE',
        isMandatory: true,
      },
    ],
    createdAt: new Date(),
  },
};

@Controller('acceptance-terms')
export class AcceptanceTermController {
  constructor(private acceptanceTermsService: AcceptanceTermService) {}

  @Get()
  async getAllAcceptanceTerms(): Promise<AcceptanceTerm[]> {
    const result = await this.acceptanceTermsService.getAll();
    return result;
  }

  @Post()
  @ApiBody({
    type: AcceptanceTerm,
    examples: { acceptanceTerms: AcceptanceTermsSchema },
  })
  @UseGuards(AuthGuard)
  async createAcceptanceTerm(
    @Body() acceptanceTerms: AcceptanceTerm,
  ): Promise<AcceptanceTerm> {
    const teste = await this.acceptanceTermsService.create(acceptanceTerms);
    return teste;
  }

  @Patch()
  @ApiBody({
    type: AcceptanceTerm,
    examples: {
      acceptanceTerms: {
        value: {
          ...AcceptanceTermsSchema.value,
          id: 1,
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  async updateAcceptanceTerm(
    @Body() acceptanceTerms: AcceptanceTerm,
  ): Promise<AcceptanceTerm> {
    return await this.acceptanceTermsService.update(acceptanceTerms);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '1',
  })
  @UseGuards(AuthGuard)
  async deleteAcceptanceTerm(@Param('id') id: number): Promise<DeleteResult> {
    return await this.acceptanceTermsService.delete(id);
  }
}
