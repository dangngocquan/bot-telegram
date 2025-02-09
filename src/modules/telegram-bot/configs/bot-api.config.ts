import { registerAs } from '@nestjs/config';

export interface BotApiConfig {
  token: string;
  webhookUrl: string;
}

export default registerAs<BotApiConfig>('bot-api-telegram', () => ({
  token: process.env.BOT_TELEGRAM_TOKEN || '',
  webhookUrl: process.env.BOT_TELEGRAM_WEBHOOK_URL || '',
}));
