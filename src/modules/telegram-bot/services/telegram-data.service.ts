import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  TelegramMessage,
  TelegramMessageDocument,
} from '../models/telegram-message.model';
import {
  TelegramTransaction,
  TelegramTransactionDocument,
} from '../models/telegram-transaction.model';
import {
  DataTelegramChannel,
  DataTelegramMessage,
  DataTelegramTransaction,
} from '../types/telegram-data.type';
import {
  TelegramChannel,
  TelegramChannelDocument,
} from '../models/telegram-channel.model';

@Injectable()
export class TelegramDataService {
  private readonly logger = new Logger(TelegramDataService.name);

  constructor(
    @InjectModel(TelegramMessage.name)
    private readonly telegramMessageModel: Model<TelegramMessageDocument>,
    @InjectModel(TelegramTransaction.name)
    private readonly telegramTransactionModel: Model<TelegramTransactionDocument>,
    @InjectModel(TelegramChannel.name)
    private readonly telegramChannelModel: Model<TelegramChannelDocument>,
  ) {}

  // Telegram Message
  async upsertTelegramMessageDocument(data: DataTelegramMessage) {
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
      if (data._id) {
        await this.telegramMessageModel.updateOne(
          {
            _id: new Types.ObjectId(data._id),
          },
          {
            $set: {
              is_replied: data.is_replied ?? false,
            },
          },
        );
        result.document = await this.telegramMessageModel.findOne({
          _id: data._id,
        });
      } else {
        const existed = await this.telegramMessageModel.findOne({
          from_user_id: data.from_user_id,
          text: data.text,
          is_replied: false,
        });
        if (existed) {
          await this.telegramMessageModel.updateOne(
            {
              _id: existed._id,
            },
            {
              $inc: {
                count: 1,
              },
            },
          );
          result.document = await this.telegramMessageModel.findOne({
            _id: existed._id,
          });
        } else {
          result.document = await this.telegramMessageModel.create({
            ...data,
            is_replied: false,
            count: 1,
          });
        }
      }
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
  async upsertTelegramTransactionDocument(data: DataTelegramTransaction) {
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
      if (data._id) {
        await this.telegramTransactionModel.updateOne(
          {
            _id: new Types.ObjectId(data._id),
          },
          {
            $set: {
              is_solved: data.is_solved ?? false,
            },
          },
        );
        result.document = await this.telegramTransactionModel.findOne({
          _id: data._id,
        });
      } else {
        result.document = await this.telegramTransactionModel.create({
          ...data,
        });
      }
    } catch (error) {
      this.logger.error(
        `[createTelegramTransactionDocument] ${JSON.stringify({ data, error })}`,
      );
      result.isBadRequest = true;
      result.message = `${error}`;
    }
    return result;
  }

  // Telegram Channel
  async upsertTelegramChannelDocument(data: DataTelegramChannel) {
    const result: {
      isBadRequest: boolean;
      message: string;
      document: TelegramChannelDocument;
    } = {
      isBadRequest: false,
      message: '',
      document: null,
    };
    try {
      const existed = await this.telegramChannelModel.findOne({
        chat_id: data.chat_id,
        chat_username: data.chat_username,
        user_telegram_id: data.user_telegram_id,
      });
      if (existed) {
        await this.telegramChannelModel.updateOne(
          {
            _id: existed._id,
          },
          {
            $set: {
              status: data.status,
            },
          },
        );
        result.document = await this.telegramChannelModel.findOne({
          _id: existed._id,
        });
      } else {
        result.document = await this.telegramChannelModel.create({
          ...data,
        });
      }
    } catch (error) {
      this.logger.error(
        `[upsertTelegramChannelDocument] ${JSON.stringify({ data, error })}`,
      );
      result.isBadRequest = true;
      result.message = `${error}`;
    }
    return result;
  }
}
