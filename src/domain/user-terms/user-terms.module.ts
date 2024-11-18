import { Module } from '@nestjs/common';
import { UserTermsService } from './user-terms.service';
import { AcceptanceTermModule } from '../acceptance-terms/module';
import { UserModule } from '../user/user.module';
import { AcceptanceTerm } from './acceptance-term-created.consumer';
import { UserConsumer } from './user-created.consumer';
import { UserConsentController } from './user-consent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTermsSchema } from './user-terms.entity';
import { UpdateConsentStatusConsumer } from './update-consent-status.consumer';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserTerms',
        schema: UserTermsSchema,
      },
    ]),
    UserModule,
    AcceptanceTermModule,
  ],
  controllers: [UserConsentController],
  providers: [
    UserTermsService,
    UserConsumer,
    AcceptanceTerm,
    UpdateConsentStatusConsumer,
    JwtService,
  ],
  exports: [UserTermsService],
})
export class UserTermsModule {}
