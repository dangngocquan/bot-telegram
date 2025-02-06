import { Injectable, Logger } from '@nestjs/common';
import { sleep } from 'src/common/sleep';
import { TelegramBotApiService } from './telegram-bot-api.service';
import { DataTelegramInvoiceLink } from '../types/telegram-bot.type';
import { TelegramBotApiUpdateResponse } from '../types/telegram-bot-api.type';
import { TelegramDataService } from './telegram-data.service';

@Injectable()
export class TelegramBotService {
  private readonly logger = new Logger(TelegramBotService.name);

  constructor(
    private readonly telegramBotApiService: TelegramBotApiService,
    private readonly telegramDataService: TelegramDataService,
  ) {}

  async setupWebhook() {
    try {
      await this.telegramBotApiService.deleteWebhook();
      let countRetry = 0;
      while (countRetry < 5) {
        const setupResult = await this.telegramBotApiService.setWebhook();
        if (setupResult.response != null) {
          this.logger.debug(
            `[setupWebhook] Setup webhook successfully, ${JSON.stringify({ setupResult })}`,
          );
          break;
        }
        this.logger.debug(
          `[setupWebhook] Failed to setup webhook, ${setupResult.message}, retrying... (${countRetry + 1})`,
        );
        countRetry++;
        await sleep(2000);
      }
    } catch (error) {
      this.logger.error(`[setupWebhook] ${error}`);
    }
  }

  async createInvoiceLink(data: DataTelegramInvoiceLink) {
    try {
      return await this.telegramBotApiService.createInvoiceLink({
        title: `${data.title}`,
        description: `${data.description}`,
        payload: `${data.payload}`,
        provider_token: '',
        currency: 'XTR',
        prices: [
          {
            label: 'Stars',
            amount: data.amount,
          },
        ],
      });
    } catch (error) {
      this.logger.error(`[createInvoiceLink] ${error}`);
    }
  }

  async handleUpdate(update: TelegramBotApiUpdateResponse) {
    try {
      switch (true) {
        case !!update?.message?.successful_payment:
          await this.telegramDataService.createTelegramTransactionDocument({
            user_telegram_id: update?.message?.from?.id,
            total_amount: update?.message?.successful_payment?.total_amount,
            invoice_payload:
              update?.message?.successful_payment?.invoice_payload,
            telegram_payment_charge_id:
              update?.message?.successful_payment?.telegram_payment_charge_id,
            provider_payment_charge_id:
              update?.message?.successful_payment?.provider_payment_charge_id,
            is_solved: false,
          });
          // SOLVE ORDER
          break;
        case !!update?.pre_checkout_query:
          await this.telegramBotApiService.answerPreCheckoutQuery({
            pre_checkout_query_id: update?.pre_checkout_query?.id,
            ok: true,
            error_message: 'Payment required',
          });
          break;
        case !!update?.message:
          await this.telegramDataService.createTelegramMessageDocument({
            chat_id: update?.message?.chat?.id,
            from_user_id: update?.message?.from?.id,
            text: update?.message?.text,
            chat_type: update?.message?.chat?.type,
            chat_username: update?.message?.chat?.username,
            message_id: update?.message?.message_id,
          });
          break;
      }
    } catch (error) {
      this.logger.error(`[handleUpdate] ${error}`);
    }
  }
}
