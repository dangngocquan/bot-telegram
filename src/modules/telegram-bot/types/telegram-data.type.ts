import { DataBaseModel } from 'src/common/model-type';

export type DataTelegramMessage = DataBaseModel & {
  message_id?: number;
  from_user_id?: number;
  chat_id?: number;
  chat_username?: string;
  chat_type?: string;
  text?: string;
  is_replied?: boolean;
  count?: number;
};

export type DataTelegramTransaction = DataBaseModel & {
  user_telegram_id?: number;
  total_amount?: number;
  invoice_payload?: string;
  is_solved?: boolean;
  telegram_payment_charge_id?: string;
  provider_payment_charge_id?: string;
};

export type DataTelegramChannel = DataBaseModel & {
  user_telegram_id?: number;
  chat_id?: number;
  chat_title?: string;
  chat_username?: string;
  chat_type?: string;
  status?: string;
};
