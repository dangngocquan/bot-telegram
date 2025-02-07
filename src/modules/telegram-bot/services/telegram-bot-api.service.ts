import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { BotConfig } from 'src/configs/bot.config';
import {
  TelegramBotApiAnswerPreCheckoutQueryRequest,
  TelegramBotApiAnswerPreCheckoutQueryResponse,
  TelegramBotApiCreateInvoiceLinkRequest,
  TelegramBotApiCreateInvoiceLinkResponse,
  TelegramBotApiDeleteWebhookRequest,
  TelegramBotApiDeleteWebhookResponse,
  TelegramBotApiSendAnimationRequest,
  TelegramBotApiSendMessageRequest,
  TelegramBotApiSendPhotoRequest,
  TelegramBotApiSetWebhookRequest,
  TelegramBotApiSetWebhookResponse,
  TelegramBotApiWebhookInfoResponse,
} from '../types/telegram-bot-api.type';

@Injectable()
export class TelegramBotApiService {
  private readonly logger = new Logger(TelegramBotApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getApiUrl() {
    const botConfig = this.configService.get<BotConfig>('bot-telegram', {
      infer: true,
    });
    this.logger.log(`[getApiUrl] ${JSON.stringify(botConfig)}`);
    return `https://api.telegram.org/bot${botConfig.token}`;
  }

  getWebhookUrl() {
    const botConfig = this.configService.get<BotConfig>('bot-telegram', {
      infer: true,
    });
    this.logger.log(`[getWebhookUrl] ${JSON.stringify(botConfig)}`);
    return `${botConfig.webhookUrl}`;
  }

  async callApiTelegram<T, D>(
    router: string,
    data?: D,
  ): Promise<{
    url: string;
    data: D;
    isBadRequest: boolean;
    message: string;
    response: T;
  }> {
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

  async setWebhook() {
    return await this.callApiTelegram<
      TelegramBotApiSetWebhookResponse,
      TelegramBotApiSetWebhookRequest
    >('setWebhook', {
      url: `${this.getWebhookUrl()}`,
      allowed_updates: [
        'message',
        'pre_checkout_query',
        'my_chat_member	',
        'chat_member',
        'chat_boost',
        'removed_chat_boost',
      ],
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
    return await this.callApiTelegram<any, TelegramBotApiSendMessageRequest>(
      'sendMessage',
      {
        ...data,
      },
    );
  }

  async sendPhoto(data: TelegramBotApiSendPhotoRequest) {
    return await this.callApiTelegram<any, TelegramBotApiSendPhotoRequest>(
      'sendPhoto',
      {
        ...data,
      },
    );
  }

  async sendAnimation(data: TelegramBotApiSendAnimationRequest) {
    return await this.callApiTelegram<any, TelegramBotApiSendAnimationRequest>(
      'sendAnimation',
      {
        ...data,
      },
    );
  }
}
