import { Body, Controller, Post } from '@nestjs/common';
import { TelegramBotService } from './services/telegram-bot.service';
import { TelegramBotApiUpdateResponse } from './types/telegram-bot-api.type';

@Controller('telegram-bot')
export class TelegramController {
  constructor(private readonly telegramService: TelegramBotService) {}

  @Post('webhook')
  async handleWebhook(@Body() update: TelegramBotApiUpdateResponse) {
    console.log(JSON.stringify({ update }));
    this.telegramService.handleUpdate(update);
  }
}
