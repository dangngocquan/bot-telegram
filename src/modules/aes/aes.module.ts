import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AESService } from './aes.service';

@Module({
  imports: [ConfigModule],
  providers: [AESService],
  exports: [AESService],
})
export class AESModule {}
