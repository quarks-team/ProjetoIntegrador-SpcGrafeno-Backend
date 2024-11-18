import { Module } from '@nestjs/common';
import { StorageModule } from 'src/infra/storage/storage.module';
import { UserModule } from '../domain/user/user.module';
import { AcceptanceTermModule } from 'src/domain/acceptance-terms/module';
import { UserTermsModule } from 'src/domain/user-terms/user-terms.module';
import { ScoreModule } from 'src/domain/score/score.module';

@Module({
  imports: [
    StorageModule,
    UserModule,
    AcceptanceTermModule,
    UserTermsModule,
    ScoreModule,
  ],
})
export class ApiModule {}
