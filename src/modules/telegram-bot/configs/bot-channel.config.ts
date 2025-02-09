import { registerAs } from '@nestjs/config';

export interface BotChannelConfig {
  token: string;
  webhookUrl: string;
}

export default registerAs<BotChannelConfig>('bot-channel-telegram', () => ({
  token: process.env.BOT_CHANNEL_TELEGRAM_TOKEN || '',
  webhookUrl: process.env.BOT_CHANNEL_TELEGRAM_WEBHOOK_URL || '',
}));
