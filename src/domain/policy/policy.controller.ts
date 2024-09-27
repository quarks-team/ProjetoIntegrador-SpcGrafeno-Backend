import {
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Controller,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { Policy } from 'src/domain/policy/policy.entity';
import { DeleteResult } from 'typeorm';
import { PolicyService } from './policy.service';

const PolicySchema = {
  value: {
    name: 'policy',
    description: 'policy description',
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

@Controller('policy')
export class PolicyController {
  constructor(private policyService: PolicyService) {}

  @Get()
  async getAllPolicies(): Promise<Policy[]> {
    const result = await this.policyService.getAll();
    return result;
  }

  @Post()
  @ApiBody({
    type: Policy,
    examples: { policy: PolicySchema },
  })
  async createPolicy(@Body() policy: Policy): Promise<Policy> {
    const teste = await this.policyService.create(policy);
    return teste;
  }

  @Patch()
  @ApiBody({
    type: Policy,
    examples: {
      policy: {
        value: {
          ...PolicySchema.value,
          id: 1,
        },
      },
    },
  })
  async updatePolicy(@Body() policy: Policy): Promise<Policy> {
    return await this.policyService.update(policy);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '1',
  })
  async deletePolicy(@Param('id') id: number): Promise<DeleteResult> {
    return await this.policyService.delete(id);
  }
}
