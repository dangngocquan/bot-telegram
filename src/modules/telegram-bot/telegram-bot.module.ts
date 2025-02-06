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

@Module({
  imports: [
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
    ]),
    HttpModule,
  ],
  controllers: [TelegramController],
  providers: [TelegramBotService, TelegramBotApiService, TelegramDataService],
  exports: [TelegramBotService, TelegramBotApiService, TelegramDataService],
})
export class TelegramBotModule {}
