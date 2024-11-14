import { Module } from '@nestjs/common';
import { UserTermsService } from './user-terms.service';
import { PolicyModule } from '../policy/policy.module';
import { UserModule } from '../user/user.module';
import { PolicyConsumer } from './policy-created.consumer';
import { UserConsumer } from './user-created.consumer';
import { UserConsentController } from './user-consent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTermsSchema } from './user-terms.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UpdateConsentStatusConsumer } from './update-consent-status.consumer';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: 'UserTerms',
        schema: UserTermsSchema,
      },
    ]),
    UserModule,
    PolicyModule,
  ],
  controllers: [UserConsentController],
  providers: [
    UserTermsService,
    UserConsumer,
    PolicyConsumer,
    UpdateConsentStatusConsumer,
  ],
  exports: [UserTermsService],
})
export class UserPolicyModule {}
