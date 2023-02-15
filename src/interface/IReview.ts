import { Model } from 'mongoose';

export interface IReview {
  review: string;
  rating: number;
  product: string[];
  user: string[];
}

export interface IReviewModel extends Model<IReview> {
  actualReview: any;
  calcAverageRatings: (id: any) => Promise<void>;
}
