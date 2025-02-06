import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TelegramMessage {
  @Prop({
    type: Number,
  })
  message_id: number;

  @Prop({
    type: Number,
  })
  from_user_id: number;

  @Prop({
    type: Number,
  })
  chat_id: number;

  @Prop({
    type: String,
  })
  chat_username: string;

  @Prop({
    type: String,
  })
  chat_type: string;

  @Prop({
    type: String,
  })
  text: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_replied: boolean;

  @Prop({
    type: Number,
    default: 1,
  })
  count: number;
}

export const TelegramMessageSchema =
  SchemaFactory.createForClass(TelegramMessage);

export type TelegramMessageDocument = TelegramMessage &
  Document<unknown> & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
