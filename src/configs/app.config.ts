import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  secret: string;
  nodeEnv: string;
  adminPassword: string;
  apiUrl: string;
  process: string;
}

export default registerAs<AppConfig>('app', () => ({
  port: parseInt(process.env.APP_PORT || '0'),
  secret: process.env.APP_SECRET || '',
  nodeEnv: process.env.APP_NODE_ENV || 'development',
  adminPassword: process.env.APP_ADMIN_PASSWORD || 'no-password',
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  process: process.env.PROCESS || 'BOT_API',
}));
