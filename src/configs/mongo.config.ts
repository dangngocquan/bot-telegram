import { registerAs } from '@nestjs/config';

export interface MongoConfig {
  url: string;
}

export default registerAs<MongoConfig>('mongo', () => ({
  url: process.env.MONGO_URL || '',
}));
