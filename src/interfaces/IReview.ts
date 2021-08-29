import mongoose from 'mongoose';

export interface IReview {
  _id?: any;
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
}