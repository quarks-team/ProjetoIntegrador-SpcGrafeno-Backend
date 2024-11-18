import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { AppConfigModule } from './infra/config/config.module';
import { TypeOrmService } from './infra/database/typeorm.service';
import { DBModule } from './infra/database/db.mocule';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongoUri'),
      }),
      inject: [ConfigService],
    }),
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    DBModule,
    ApiModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('bull').host,
          port: configService.get('bull').port,
          username: configService.get('bull').username,
          password: configService.get('bull').password,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
