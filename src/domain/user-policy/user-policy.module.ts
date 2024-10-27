import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPolicyService } from './user-policy.service';
import { UserPolicy } from './user-policy.entity';
import { PolicyModule } from '../policy/policy.module';
import { UserModule } from '../user/user.module';
import { PolicyConsumer } from './policy-created.consumer';
import { UserConsumer } from './user-created.consumer';
import { UserConsentConsumer } from './user-consent-agree.consumer';
import { UserConsentController } from './user-consent.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPolicy]),
    UserModule,
    PolicyModule,
  ],
  controllers: [UserConsentController],
  providers: [
    UserPolicyService,
    UserConsumer,
    PolicyConsumer,
    UserConsentConsumer,
  ],
  exports: [UserPolicyService],
})
export class UserPolicyModule {}
