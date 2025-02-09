import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { RedisConfig } from 'src/modules/redis/redis.config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(CACHE_MANAGER) private readonly cacheStore: Cache;

  async set(key: string, value: any, ttl?: number) {
    try {
      const redisConfig = this.configService.get<RedisConfig>('redis');
      await this.cacheStore.set(
        `${redisConfig.prefix}/${key}`,
        `${value}`,
        ttl ? ttl : 10000000000,
      );
    } catch (error) {
      this.logger.error(
        `[set] ${JSON.stringify({ key, value, ttl })}, error: ${error?.message || error.toString()}`,
      );
    }
  }

  async get(key: string) {
    try {
      const redisConfig = this.configService.get<RedisConfig>('redis');
      return await this.cacheStore.get(`${redisConfig.prefix}/${key}`);
    } catch (error) {
      this.logger.error(
        `[get] ${key}, error: ${error?.message || error.toString()}`,
      );
    }
  }

  async del(key: string) {
    try {
      const redisConfig = this.configService.get<RedisConfig>('redis');
      return await this.cacheStore.del(`${redisConfig.prefix}/${key}`);
    } catch (error) {
      this.logger.error(
        `[del] ${key}, error: ${error?.message || error.toString()}`,
      );
    }
  }
}
