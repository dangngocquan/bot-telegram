import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  url: string;
  prefix: string;
}

export default registerAs<RedisConfig>('redis', () => ({
  url: process.env.REDIS_URL || '',
  prefix: process.env.REDIS_PREFIX || '',
}));
