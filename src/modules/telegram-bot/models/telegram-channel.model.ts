import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TelegramChannelDocument = TelegramChannel &
  Document & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class TelegramChannel {
  @Prop({
    type: Number,
  })
  user_telegram_id: number;

  @Prop({
    type: Number,
  })
  chat_id: number;

  @Prop({
    type: String,
  })
  chat_title: string;

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
    default: 'member',
  })
  status: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_solved: boolean;
}

export const TelegramChannelSchema =
  SchemaFactory.createForClass(TelegramChannel);
