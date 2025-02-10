import { Module } from '@nestjs/common';
import { TelegramNotificationSchedule } from './telegram-notification.schedule';
import { TelegramBotModule } from 'src/modules/telegram-bot/telegram-bot.module';
import { TelegramMessageSchedule } from './telegram-message.schedule';

@Module({
  imports: [TelegramBotModule],
  controllers: [],
  providers: [TelegramNotificationSchedule, TelegramMessageSchedule],
})
export class ScheduleModule {}
