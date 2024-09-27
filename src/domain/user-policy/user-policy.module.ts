import { Module } from '@nestjs/common';
import { UserPolicyService } from './user-policy.service';
import { PolicyModule } from '../policy/policy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPolicy } from './user-policy.entity';
import { UserModule } from '../user/user.module';
import { PolicyConsumer } from './policy-created.consumer';
import { UserConsumer } from './user-created.consumer';
import { UserConsentConsumer } from './user-consent-agree.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([UserPolicy]), UserModule, PolicyModule],
  providers: [
    UserPolicyService,
    UserConsumer,
    PolicyConsumer,
    UserConsentConsumer,
  ],
  exports: [UserPolicyService],
})
export class UserPolicyModule {}
