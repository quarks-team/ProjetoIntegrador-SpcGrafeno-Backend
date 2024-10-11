import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Storage {
  private storage: Client;
  private storageEnv: any;

  constructor(private configService: ConfigService) {
    this.storageEnv = this.configService.get('storage');

    this.storage = new Client({
      endPoint: this.storageEnv.url,
      port: 443,
      region: 'us-west-2',
      useSSL: true,
      accessKey: this.storageEnv.accessKey,
      secretKey: this.storageEnv.secretKey,
    });
  }

  public async getObject(key: string): Promise<any> {
    return this.storage.getObject(this.storageEnv.bucket, key);
  }

  public async putObject(obj: any): Promise<any> {
    return this.storage.fPutObject(this.storageEnv.bucket, obj?.name, obj.path);
  }
}
