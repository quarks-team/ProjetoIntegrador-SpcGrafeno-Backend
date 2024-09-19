import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entites/user';
import { ApiModule } from './api/api.module';
import { AppConfigModule } from './infra/config/config.module';
import { TypeOrmService } from './infra/database/typeorm.service';
import { DBModule } from './infra/database/db.mocule';
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    DBModule,
    TypeOrmModule.forFeature([User]),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
