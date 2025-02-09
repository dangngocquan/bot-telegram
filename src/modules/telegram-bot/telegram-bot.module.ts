import { Module } from '@nestjs/common';
import { TelegramController } from './telegram-bot.controller';
import { TelegramBotService } from './services/telegram-bot.service';
import { HttpModule } from '@nestjs/axios';
import { TelegramBotApiService } from './services/telegram-bot-api.service';
import { TelegramDataService } from './services/telegram-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TelegramMessage,
  TelegramMessageSchema,
} from './models/telegram-message.model';
import {
  TelegramTransaction,
  TelegramTransactionSchema,
} from './models/telegram-transaction.model';
import {
  TelegramChannel,
  TelegramChannelSchema,
} from './models/telegram-channel.model';
import {
  TelegramNotification,
  TelegramNotificationSchema,
} from './models/telegram-notification.model';
import botApiConfig from 'src/modules/telegram-bot/configs/bot-api.config';
import botChannelConfig from 'src/modules/telegram-bot/configs/bot-channel.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [botApiConfig, botChannelConfig],
    }),
    MongooseModule.forFeature([
      {
        name: TelegramMessage.name,
        schema: TelegramMessageSchema,
      },
      {
        name: TelegramTransaction.name,
        schema: TelegramTransactionSchema,
      },
      {
        name: TelegramChannel.name,
        schema: TelegramChannelSchema,
      },
      {
        name: TelegramNotification.name,
        schema: TelegramNotificationSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [TelegramController],
  providers: [TelegramBotService, TelegramBotApiService, TelegramDataService],
  exports: [TelegramBotService, TelegramBotApiService, TelegramDataService],
})
export class TelegramBotModule {}
