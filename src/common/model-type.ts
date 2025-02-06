import { Types } from 'mongoose';

export type DataBaseModel = {
  _id?: string | Types.ObjectId;
  createdAt?: string | Date | number;
  updatedAt?: string | Date | number;
  metadata?: any;
};
