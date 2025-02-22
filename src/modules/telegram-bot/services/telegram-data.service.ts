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
  DataTelegramNotification,
  DataTelegramTransaction,
  ETelegramNotificationStatus,
} from '../types/telegram-data.type';
import {
  TelegramChannel,
  TelegramChannelDocument,
} from '../models/telegram-channel.model';
import {
  TelegramNotification,
  TelegramNotificationDocument,
} from '../models/telegram-notification.model';

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
    @InjectModel(TelegramNotification.name)
    private readonly telegramNotificationModel: Model<TelegramNotificationDocument>,
  ) {}

  // Telegram Message
  async getPendingTelegramMessages(limit: number): Promise<{
    messages: Array<DataTelegramMessage>;
    limit: number;
    count: number;
  }> {
    const result: {
      messages: Array<DataTelegramMessage>;
      limit: number;
      count: number;
    } = {
      messages: [],
      limit,
      count: 0,
    };
    try {
      result.messages = await this.telegramMessageModel
        .find({
          is_solved: false,
        })
        .limit(limit)
        .exec();
      result.count = result.messages.length;
      if (result.count > 0) {
        await this.telegramMessageModel.updateMany(
          {
            _id: { $in: result.messages.map((m) => m._id) },
          },
          {
            $set: {
              is_solved: true,
            },
          },
        );
      }
    } catch (error) {
      this.logger.error(
        `[getPendingTelegramMessages] ${JSON.stringify({ error, limit })}`,
      );
    }
    return result;
  }

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
              is_solved: data.is_solved ?? false,
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
          is_solved: false,
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
            is_solved: false,
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
              is_solved: data.is_solved ?? false,
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

  // Telegram Notification
  async getPendingTelegramNotifications(limit: number): Promise<{
    notifications: Array<DataTelegramNotification>;
    limit: number;
    count: number;
  }> {
    const result: {
      notifications: Array<DataTelegramNotification>;
      limit: number;
      count: number;
    } = {
      notifications: [],
      limit,
      count: 0,
    };
    try {
      result.notifications = await this.telegramNotificationModel
        .find({
          status: ETelegramNotificationStatus.PENDING,
        })
        .sort({ priority: -1 })
        .limit(limit)
        .exec();
      result.count = result.notifications.length;
      if (result.count > 0) {
        await this.telegramNotificationModel.updateMany(
          {
            _id: { $in: result.notifications.map((m) => m._id) },
          },
          {
            $set: {
              status: ETelegramNotificationStatus.PROCESSING,
            },
          },
        );
      }
    } catch (error) {
      this.logger.error(
        `[getPendingTelegramNotifications] ${JSON.stringify({ error, limit })}`,
      );
    }
    return result;
  }

  async upsertTelegramNotificationDocument(data: DataTelegramNotification) {
    const result: {
      isBadRequest: boolean;
      message: string;
      document: TelegramNotificationDocument;
    } = {
      isBadRequest: false,
      message: '',
      document: null,
    };
    try {
      if (data._id) {
        await this.telegramNotificationModel.updateOne(
          {
            _id: new Types.ObjectId(data._id),
          },
          {
            $set: {
              status: data.status ?? ETelegramNotificationStatus.PENDING,
              metadata: data.metadata,
            },
          },
        );
        result.document = await this.telegramNotificationModel.findOne({
          _id: data._id,
        });
      } else {
        result.document = await this.telegramNotificationModel.create({
          ...data,
        });
      }
    } catch (error) {
      this.logger.error(
        `[upsertTelegramNotificationDocument] ${JSON.stringify({ data, error })}`,
      );
      result.isBadRequest = true;
      result.message = `${error}`;
    }
    return result;
  }
}
