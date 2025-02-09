import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { BotApiConfig } from 'src/modules/telegram-bot/configs/bot-api.config';
import {
  TelegramBotApiAnswerPreCheckoutQueryRequest,
  TelegramBotApiAnswerPreCheckoutQueryResponse,
  TelegramBotApiCreateInvoiceLinkRequest,
  TelegramBotApiCreateInvoiceLinkResponse,
  TelegramBotApiDeleteWebhookRequest,
  TelegramBotApiDeleteWebhookResponse,
  TelegramBotApiSendAnimationRequest,
  TelegramBotApiSendMediaResponse,
  TelegramBotApiSendMessageRequest,
  TelegramBotApiSendPhotoRequest,
  TelegramBotApiSetWebhookRequest,
  TelegramBotApiSetWebhookResponse,
  TelegramBotApiWebhookInfoResponse,
} from '../types/telegram-bot-api.type';
import { AppConfig } from 'src/configs/app.config';
import { BotChannelConfig } from 'src/modules/telegram-bot/configs/bot-channel.config';
import { DataTelegramApiResponse } from '../types/telegram-bot.type';

@Injectable()
export class TelegramBotApiService {
  private readonly logger = new Logger(TelegramBotApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getBotConfig() {
    const appConfig = this.configService.get<AppConfig>('app', { infer: true });
    let botName = '';
    switch (appConfig.process) {
      case 'BOT_API':
        botName = 'bot-api-telegram';
        break;
      case 'BOT_CHANNEL':
        botName = 'bot-channel-telegram';
      default:
        break;
    }
    const botConfig: BotApiConfig | BotChannelConfig = this.configService.get<
      BotApiConfig | BotChannelConfig
    >(botName, {
      infer: true,
    });
    return botConfig;
  }

  getApiUrl() {
    const botConfig = this.getBotConfig();
    return `https://api.telegram.org/bot${botConfig.token}`;
  }

  getWebhookUrl() {
    const botConfig = this.getBotConfig();
    return `${botConfig.webhookUrl}`;
  }

  async callApiTelegram<T, D>(
    router: string,
    data?: D,
  ): Promise<DataTelegramApiResponse<D, T>> {
    const result: {
      url: string;
      data: D;
      isBadRequest: boolean;
      message: string;
      response: T;
    } = {
      url: '',
      data,
      isBadRequest: false,
      message: '',
      response: null,
    };
    try {
      result.url = `${this.getApiUrl()}/${router}`;
      const response = await firstValueFrom(
        this.httpService.post(result.url, data ?? {}).pipe(
          catchError((error) => {
            console.log(
              `[callApiTelegram] [${result.url}] ${JSON.stringify({ error, router, data })}`,
            );
            result.isBadRequest = true;
            result.message = `${error.response?.data}`;
            throw error;
          }),
        ),
      );
      result.response = response.data as T;
    } catch (error) {
      console.log(
        `[callApiTelegram] [${result.url}] ${JSON.stringify({ error, router, data })}`,
      );
      result.isBadRequest = true;
      result.message = `${error}`;
    }
    return result;
  }

  async getWebhookInfo() {
    return await this.callApiTelegram<TelegramBotApiWebhookInfoResponse, any>(
      'getWebhookInfo',
    );
  }

  async setWebhook(
    allowed_updates: Array<
      | 'message'
      | 'pre_checkout_query'
      | 'my_chat_member	'
      | 'chat_member'
      | 'chat_boost'
      | 'removed_chat_boost'
    >,
  ) {
    return await this.callApiTelegram<
      TelegramBotApiSetWebhookResponse,
      TelegramBotApiSetWebhookRequest
    >('setWebhook', {
      url: `${this.getWebhookUrl()}`,
      allowed_updates,
    });
  }

  async deleteWebhook() {
    return await this.callApiTelegram<
      TelegramBotApiDeleteWebhookResponse,
      TelegramBotApiDeleteWebhookRequest
    >('deleteWebhook', {
      drop_pending_updates: false,
    });
  }

  async createInvoiceLink(data: TelegramBotApiCreateInvoiceLinkRequest) {
    return await this.callApiTelegram<
      TelegramBotApiCreateInvoiceLinkResponse,
      TelegramBotApiCreateInvoiceLinkRequest
    >('createInvoiceLink', {
      ...data,
    });
  }
  async answerPreCheckoutQuery(
    data: TelegramBotApiAnswerPreCheckoutQueryRequest,
  ) {
    return await this.callApiTelegram<
      TelegramBotApiAnswerPreCheckoutQueryResponse,
      TelegramBotApiAnswerPreCheckoutQueryRequest
    >('answerPreCheckoutQuery', {
      ...data,
    });
  }

  async sendMessage(data: TelegramBotApiSendMessageRequest) {
    return await this.callApiTelegram<
      TelegramBotApiSendMediaResponse,
      TelegramBotApiSendMessageRequest
    >('sendMessage', {
      ...data,
    });
  }

  async sendPhoto(data: TelegramBotApiSendPhotoRequest) {
    return await this.callApiTelegram<
      TelegramBotApiSendMediaResponse,
      TelegramBotApiSendPhotoRequest
    >('sendPhoto', {
      ...data,
    });
  }

  async sendAnimation(data: TelegramBotApiSendAnimationRequest) {
    return await this.callApiTelegram<
      TelegramBotApiSendMediaResponse,
      TelegramBotApiSendAnimationRequest
    >('sendAnimation', {
      ...data,
    });
  }
}
