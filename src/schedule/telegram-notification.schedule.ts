/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { sleep } from 'src/common/sleep';
import { TelegramBotService } from 'src/modules/telegram-bot/services/telegram-bot.service';
import { TelegramDataService } from 'src/modules/telegram-bot/services/telegram-data.service';

@Injectable()
export class TelegramNotificationSchedule implements OnModuleInit {
  private readonly logger = new Logger(TelegramNotificationSchedule.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly telegramBotService: TelegramBotService,
    private readonly telegramDataService: TelegramDataService,
  ) {}

  onModuleInit() {}

  @Cron(CronExpression.EVERY_SECOND, {
    timeZone: 'UTC',
    name: 'notification',
  })
  async notification() {
    this.schedulerRegistry.getCronJob('notification').stop();
    const data =
      await this.telegramDataService.getPendingTelegramNotifications(10);
    for (let i = 0; i < data.notifications.length; i++) {
      this.telegramBotService.handleNotification(data.notifications[i]);
      await sleep(Math.round(1000 / 10));
    }
    this.schedulerRegistry.getCronJob('notification').start();
  }
}
