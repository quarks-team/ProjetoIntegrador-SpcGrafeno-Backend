import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from 'src/infra/storage/storage.module';
import { User } from 'src/domain/user/user.entity';
import { Policy } from 'src/domain/policy/policy.entity';
import { UserPolicy } from 'src/domain/user-policy/user-policy.entity';
import { UserModule } from '../domain/user/user.module';
import { PolicyModule } from 'src/domain/policy/policy.module';
import { UserPolicyModule } from 'src/domain/user-policy/user-policy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Policy]),
    TypeOrmModule.forFeature([UserPolicy]),
    StorageModule,
    UserModule,
    PolicyModule,
    UserPolicyModule,
  ],
})
export class ApiModule {}
