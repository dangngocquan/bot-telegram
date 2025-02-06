import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TelegramTransaction {
  @Prop({
    type: Number,
  })
  user_telegram_id: number;

  @Prop({
    type: Number,
  })
  total_amount: number;

  @Prop({
    type: String,
  })
  invoice_payload: string;

  @Prop({
    type: String,
  })
  telegram_payment_charge_id: string;

  @Prop({
    type: String,
  })
  provider_payment_charge_id: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_solved: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const TelegramTransactionSchema =
  SchemaFactory.createForClass(TelegramTransaction);

export type TelegramTransactionDocument = TelegramTransaction &
  Document<unknown> & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
