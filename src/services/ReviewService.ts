import { FilterQuery } from 'mongoose';
import { IReview } from '../interface/IReview';
import { Review } from '../models/ReviewModel';

class ReviewService {
  async create(review: IReview) {
    const newReview = await Review.create(review);
    return newReview;
  }

  async getAll(filter: FilterQuery<IReview>) {
    const reviews = await Review.find(filter);
    return reviews;
  }
}

export default new ReviewService();
