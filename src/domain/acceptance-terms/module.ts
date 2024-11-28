import { Module } from '@nestjs/common';
import { AcceptanceTermService } from './service';
import { AcceptanceTermController } from 'src/domain/acceptance-terms/controller';
import { AcceptanceTermSchema } from './acceptance-term.entity';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'AcceptanceTerm',
        schema: AcceptanceTermSchema,
      },
    ]),
    BullModule.registerQueue({
      name: 'acceptanceTerm-created',
    }),
    BullBoardModule.forFeature({
      name: 'acceptanceTerm-created',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  providers: [AcceptanceTermService, JwtService],
  controllers: [AcceptanceTermController],
  exports: [AcceptanceTermService],
})
export class AcceptanceTermModule {}
