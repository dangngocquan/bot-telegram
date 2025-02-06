import { registerAs } from '@nestjs/config';

export interface BotConfig {
  token: string;
  webhookUrl: string;
}

export default registerAs<BotConfig>('bot-telegram', () => ({
  token: process.env.BOT_TELEGRAM_TOKEN || '',
  webhookUrl: process.env.BOT_TELEGRAM_WEBHOOK_URL || '',
}));
