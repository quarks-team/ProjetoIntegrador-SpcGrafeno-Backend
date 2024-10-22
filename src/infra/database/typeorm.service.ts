import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Policy } from '../../domain/policy/policy.entity';
import { User } from '../../domain/user/user.entity';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseEnv = this.configService.get('database');

    return {
      type: 'postgres',
      host: databaseEnv.host,
      port: databaseEnv.port,
      username: databaseEnv.username,
      password: databaseEnv.password,
      database: databaseEnv.name,
      entities: [User, Policy],
      autoLoadEntities: true,
      synchronize: false,
    };
  }
}
