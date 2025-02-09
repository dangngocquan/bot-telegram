import { Injectable, Logger } from '@nestjs/common';
import { sleep } from 'src/common/sleep';
import { TelegramBotApiService } from './telegram-bot-api.service';
import {
  DataTelegramApiResponse,
  DataTelegramInvoiceLink,
} from '../types/telegram-bot.type';
import {
  TelegramBotApiSendAnimationRequest,
  TelegramBotApiSendMediaResponse,
  TelegramBotApiSendMessageRequest,
  TelegramBotApiSendPhotoRequest,
  TelegramBotApiUpdateResponse,
} from '../types/telegram-bot-api.type';
import { TelegramDataService } from './telegram-data.service';
import {
  DataTelegramNotification,
  EMediaType,
  ETelegramNotificationStatus,
} from '../types/telegram-data.type';

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
        const setupResult = await this.telegramBotApiService.setWebhook([
          'message',
          'pre_checkout_query',
          'my_chat_member	',
          'chat_member',
          'chat_boost',
          'removed_chat_boost',
        ]);
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
        case !!update?.message?.successful_payment: // CASE PAYMENT STAR
          await this.telegramDataService.upsertTelegramTransactionDocument({
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
        case !!update?.pre_checkout_query: // CASE ALLOW PRE CHECKOUT QUERY PAYMENT STAR
          await this.telegramBotApiService.answerPreCheckoutQuery({
            pre_checkout_query_id: update?.pre_checkout_query?.id,
            ok: true,
            error_message: 'Payment required',
          });
          break;
        case !!update?.chat_member: // CASE JOIN/LEFT GROUP/CHANNEL
          await this.telegramDataService.upsertTelegramChannelDocument({
            user_telegram_id: update?.chat_member.new_chat_member.user?.id,
            chat_id: update?.chat_member?.chat?.id,
            chat_title: update?.chat_member?.chat?.title,
            chat_username: update?.chat_member?.chat?.username,
            chat_type: update?.chat_member?.chat?.type,
            status: update?.chat_member?.new_chat_member?.status,
          });
          break;
        case !!update?.message?.text: // CASE NORMAL MESSAGE
          await this.telegramDataService.upsertTelegramMessageDocument({
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

  async handleNotification(data: DataTelegramNotification) {
    let result: DataTelegramApiResponse<
      | TelegramBotApiSendMessageRequest
      | TelegramBotApiSendPhotoRequest
      | TelegramBotApiSendAnimationRequest,
      TelegramBotApiSendMediaResponse
    >;
    data.content = new Date().toISOString();
    try {
      const payload = {
        chat_id: data.telegram_id,
        parse_mode: 'HTML',
        link_preview_options: {
          is_disabled: true,
        },
        reply_markup: {
          inline_keyboard: data.buttons.map((rows) =>
            rows.map((r) => {
              const obj = {
                text: r.text,
              };
              if (r.web_app) {
                obj['web_app'] = r.web_app;
              } else if (r.url) {
                obj['url'] = r.url;
              }
              return obj;
            }),
          ),
        },
      };
      switch (data.mediaType) {
        case EMediaType.PHOTO:
          result = await this.telegramBotApiService.sendPhoto({
            ...payload,
            photo: data.media,
            caption: data.content,
          });
          break;
        case EMediaType.ANIMATION:
          result = await this.telegramBotApiService.sendAnimation({
            ...payload,
            animation: data.media,
            caption: data.content,
          });
          break;
        default:
          result = await this.telegramBotApiService.sendMessage({
            ...payload,
            text: data.content,
          });
          break;
      }
    } catch (error) {
      this.logger.error(`[handleNotification] ${error}`);
    }
    if (result) {
      this.telegramDataService.upsertTelegramNotificationDocument({
        _id: data._id,
        status: result?.isBadRequest
          ? ETelegramNotificationStatus.FAILED
          : ETelegramNotificationStatus.SUCCEEDED,
      });
    }
    return result;
  }
}
