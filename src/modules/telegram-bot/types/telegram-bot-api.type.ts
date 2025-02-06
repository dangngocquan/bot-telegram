// WEBHOOK
export type TelegramBotApiSetWebhookRequest = {
  url: string;
  allowed_updates?: string[];
};

export type TelegramBotApiSetWebhookResponse = {
  ok: boolean;
  result: boolean;
  description: string;
};

export type TelegramBotApiDeleteWebhookRequest = {
  drop_pending_updates?: boolean;
};

export type TelegramBotApiDeleteWebhookResponse = {
  ok: boolean;
  result: boolean;
  description: string;
};

export type TelegramBotApiWebhookInfoResponse = {
  url: string;
  ip_address: string;
  max_connections: number;
};

// USER
export type TelegramBotApiUserResponse = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
};

// CHAT
export type TelegramBotApiChatResponse = {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type TelegramBotApiChatMemberMemberResponse = {
  status: string; // member
  user: TelegramBotApiUserResponse;
};

export type TelegramBotApiChatMemberOwnerResponse = {
  status: string; // creator
  user: TelegramBotApiUserResponse;
  is_anonymous: boolean;
};

export type TelegramBotApiChatMemberAdministratorResponse = {
  status: string; // administrator
  user: TelegramBotApiUserResponse;
  is_anonymous: boolean;
};

export type TelegramBotApiChatMemberResponse =
  | TelegramBotApiChatMemberMemberResponse
  | TelegramBotApiChatMemberOwnerResponse
  | TelegramBotApiChatMemberAdministratorResponse;

export type TelegramBotApiChatMemberUpdatedResponse = {
  chat: TelegramBotApiChatResponse;
  fro: TelegramBotApiUserResponse;
  date: number;
  old_chat_member: TelegramBotApiChatMemberResponse;
  new_chat_member: TelegramBotApiChatMemberResponse;
};

// PAYMENT
export type TelegramBotApiCreateInvoiceLinkRequest = {
  title: string;
  description: string;
  payload: string;
  provider_token?: string;
  currency: string;
  prices: Array<{ label: string; amount: number }>;
};

export type TelegramBotApiCreateInvoiceLinkResponse = {
  ok: boolean;
  result: string;
};

export type TelegramBotApiInvoiceResponse = {
  title: string;
  description: string;
  start_parameter: string;
  currency: string;
  total_amount: number;
};

export type TelegramBotApiPreCheckoutQueryResponse = {
  id: string;
  from: TelegramBotApiUserResponse;
  currency: string;
  total_amount: number;
  invoice_payload: string;
};

export type TelegramBotApiAnswerPreCheckoutQueryRequest = {
  pre_checkout_query_id: string;
  ok: boolean;
  error_message?: string;
};

export type TelegramBotApiAnswerPreCheckoutQueryResponse = {
  ok: boolean;
  result: boolean;
};

export type TelegramBotApiSuccessfulPaymentResponse = {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
};

// MESSAGE
export type TelegramBotApiMessageResponse = {
  message_id: number;
  message_thread_id?: number;
  from?: TelegramBotApiUserResponse;
  sender_chat?: TelegramBotApiChatResponse;
  sender_boost_count?: number;
  date: number;
  chat: TelegramBotApiChatResponse;
  text?: string;
  new_chat_members?: TelegramBotApiUserResponse[];
  left_chat_member?: TelegramBotApiUserResponse;
  migrate_to_chat_id?: number;
  migrate_from_chat_id?: number;
  invoice?: TelegramBotApiInvoiceResponse;
  successful_payment?: TelegramBotApiSuccessfulPaymentResponse;
};

// UPDATE
export type TelegramBotApiUpdateResponse = {
  update_id: number;
  message?: TelegramBotApiMessageResponse;
  edited_message?: TelegramBotApiMessageResponse;
  channel_post?: TelegramBotApiMessageResponse;
  edited_channel_post?: TelegramBotApiMessageResponse;
  pre_checkout_query?: TelegramBotApiPreCheckoutQueryResponse;
  my_chat_member?: any;
  chat_member?: any;
  chat_join_request?: any;
  chat_boost?: any;
  removed_chat_boost?: any;
};
