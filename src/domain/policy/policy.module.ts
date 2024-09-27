import { Module } from '@nestjs/common';
import { PolicyService } from './policy.service';
import { PolicyController } from 'src/domain/policy/policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './policy.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Policy]),
    BullModule.registerQueue({
      name: 'policy-created',
    }),
  ],
  providers: [PolicyService],
  controllers: [PolicyController],
  exports: [PolicyService],
})
export class PolicyModule {}
