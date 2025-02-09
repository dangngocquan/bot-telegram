import { Module } from '@nestjs/common';
import { TelegramNotificationSchedule } from './telegram-notification.schedule';
import { TelegramBotModule } from 'src/modules/telegram-bot/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [],
  providers: [TelegramNotificationSchedule],
})
export class ScheduleModule {}
