export type DataTelegramInvoiceLink = {
  title: string;
  description: string;
  amount: number;
  payload: string;
};

export type DataTelegramApiResponse<D, T> = {
  url: string;
  data: D;
  isBadRequest: boolean;
  message: string;
  response: T;
};
