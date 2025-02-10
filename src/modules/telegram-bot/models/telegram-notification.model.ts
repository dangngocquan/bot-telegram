import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  EMediaType,
  ETelegramNotificationStatus,
} from '../types/telegram-data.type';

@Schema({ timestamps: true })
export class TelegramNotification {
  @Prop({
    type: [
      [
        {
          type: {
            text: String,
            url: String,
            web_app: String,
          },
          _id: false,
        },
      ],
    ],
    _id: false,
    default: [],
  })
  buttons: Array<
    Array<{
      text: string;
      url?: string;
      web_app?: string;
    }>
  >;

  @Prop({ type: String, default: '' })
  content: string;

  @Prop({ type: String, default: '' })
  media: string;

  @Prop({ type: Number, default: 104104104 })
  telegram_id: number;

  @Prop({ type: Date, default: new Date() })
  startAt: Date;

  @Prop({ type: Number, default: 1, index: true })
  priority: number;

  @Prop({
    type: String,
    default: ETelegramNotificationStatus.PENDING,
    enum: ETelegramNotificationStatus,
    index: true,
  })
  status: ETelegramNotificationStatus;

  @Prop({
    type: String,
    default: EMediaType.MESSAGE,
    enum: EMediaType,
  })
  mediaType: EMediaType;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export type TelegramNotificationDocument = TelegramNotification &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

export const TelegramNotificationSchema =
  SchemaFactory.createForClass(TelegramNotification);
