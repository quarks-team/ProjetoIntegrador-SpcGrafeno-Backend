import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StorageModule } from 'src/infra/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    StorageModule,
    BullModule.registerQueue({
      name: 'user-created',
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
