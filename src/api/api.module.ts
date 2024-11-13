import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from 'src/infra/storage/storage.module';
import { User } from 'src/domain/user/user.entity';
import { Policy } from 'src/domain/policy/policy.entity';
import { UserModule } from '../domain/user/user.module';
import { PolicyModule } from 'src/domain/policy/policy.module';
import { UserPolicyModule } from 'src/domain/user-policy/user-terms.module';
import { ScoreModule } from 'src/domain/score/score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Policy]),
    StorageModule,
    UserModule,
    PolicyModule,
    UserPolicyModule,
    ScoreModule,
  ],
})
export class ApiModule {}
