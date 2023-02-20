import { FilterQuery } from 'mongoose';
import { IReview } from '../interface/IReview';
import { Review } from '../models/ReviewModel';

class ReviewService {
  async deleteOne(id: string) {
    const deleted = await Review.findByIdAndDelete(id);
    return deleted;
  }
  async create(review: IReview) {
    const newReview = await Review.create(review);
    return newReview;
  }

  async update(id: string, product: IReview) {
    const updatedProduct = await Review.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!updatedProduct) {
      throw new Error('Review not found.');
    }
    return updatedProduct;
  }

  async getAll(filter: FilterQuery<IReview>) {
    const reviews = await Review.find(filter);
    return reviews;
  }
}

export default new ReviewService();
