import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from 'src/domain/entites/user';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions() {
    const databaseEnv = this.configService.get('database');

    return {
      type: 'postgres',
      host: databaseEnv.host,
      port: databaseEnv.port,
      username: databaseEnv.username,
      password: databaseEnv.password,
      database: databaseEnv.name,
      entities: [User],
      synchronize: true,
    };
  }
}
