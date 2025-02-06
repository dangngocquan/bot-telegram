import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TelegramMessage,
  TelegramMessageDocument,
} from '../models/telegram-message.model';
import {
  TelegramTransaction,
  TelegramTransactionDocument,
} from '../models/telegram-transaction.model';
import {
  DataTelegramMessage,
  DataTelegramTransaction,
} from '../types/telegram-data.type';

@Injectable()
export class TelegramDataService {
  private readonly logger = new Logger(TelegramDataService.name);

  constructor(
    @InjectModel(TelegramMessage.name)
    private readonly telegramMessageModel: Model<TelegramMessageDocument>,
    @InjectModel(TelegramTransaction.name)
    private readonly telegramTransactionModel: Model<TelegramTransactionDocument>,
  ) {}

  // Telegram Message
  async createTelegramMessageDocument(data: DataTelegramMessage) {
    const result: {
      isBadRequest: boolean;
      message: string;
      document: TelegramMessageDocument;
    } = {
      isBadRequest: false,
      message: '',
      document: null,
    };
    try {
      result.document = await this.telegramMessageModel.create({
        ...data,
      });
      await result.document.save();
    } catch (error) {
      this.logger.error(
        `[createTelegramMessageDocument] ${JSON.stringify({ data, error })}`,
      );
      result.isBadRequest = true;
      result.message = `${error}`;
    }
    return result;
  }

  // Telegram Transaction
  async createTelegramTransactionDocument(data: DataTelegramTransaction) {
    const result: {
      isBadRequest: boolean;
      message: string;
      document: TelegramTransactionDocument;
    } = {
      isBadRequest: false,
      message: '',
      document: null,
    };
    try {
      result.document = await this.telegramTransactionModel.create({
        ...data,
      });
      await result.document.save();
    } catch (error) {
      this.logger.error(
        `[createTelegramTransactionDocument] ${JSON.stringify({ data, error })}`,
      );
      result.isBadRequest = true;
      result.message = `${error}`;
    }
    return result;
  }
}
