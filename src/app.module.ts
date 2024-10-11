import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user/user.entity';
import { ApiModule } from './api/api.module';
import { AppConfigModule } from './infra/config/config.module';
import { TypeOrmService } from './infra/database/typeorm.service';
import { DBModule } from './infra/database/db.mocule';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
    DBModule,
    TypeOrmModule.forFeature([User]),
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
