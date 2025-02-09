import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisConfig } from 'src/modules/redis/redis.config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        const store = await redisStore({
          url: redisConfig.url,
        });

        return {
          store: store as unknown as Cache,
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
