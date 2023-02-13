import { IReview } from '../interface/IReview';
import { Review } from '../models/ReviewModel';

class ReviewService {
  async create(review: IReview) {
    const newReview = await Review.create(review);
    return newReview;
  }

  async getAll() {
    const reviews = await Review.find();
    return reviews;
  }
}

export default new ReviewService();
