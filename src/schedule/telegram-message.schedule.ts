/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { TelegramDataService } from 'src/modules/telegram-bot/services/telegram-data.service';
import {
  EMediaType,
  ETelegramNotificationStatus,
} from 'src/modules/telegram-bot/types/telegram-data.type';

@Injectable()
export class TelegramMessageSchedule implements OnModuleInit {
  private readonly logger = new Logger(TelegramMessageSchedule.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly telegramDataService: TelegramDataService,
  ) {}

  onModuleInit() {}

  @Cron('*/3 * * * * *', {
    timeZone: 'UTC',
    name: 'replyTelegramMessage',
  })
  async replyMessages() {
    this.schedulerRegistry.getCronJob('replyTelegramMessage').stop();
    const data = await this.telegramDataService.getPendingTelegramMessages(10);
    for (let i = 0; i < data.messages.length; i++) {
      switch (data.messages[i].text) {
        case '/start':
          this.telegramDataService.upsertTelegramNotificationDocument({
            media: null,
            buttons: [
              [
                {
                  text: 'Join',
                  url: 'https://core.telegram.org/bots/api#sendphoto',
                },
              ],
            ],
            content: 'Welcome to the Telegram',
            telegram_id: data.messages[i].from_user_id,
            startAt: new Date(),
            priority: 2,
            status: ETelegramNotificationStatus.PENDING,
            metadata: {},
            mediaType: EMediaType.MESSAGE,
          });
          break;
      }
    }
    this.schedulerRegistry.getCronJob('replyTelegramMessage').start();
  }
}
