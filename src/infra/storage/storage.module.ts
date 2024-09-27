import { Module } from '@nestjs/common';
import { Storage } from './storage';
@Module({
  providers: [Storage],
  exports: [Storage],
})
export class StorageModule {}
