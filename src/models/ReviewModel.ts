import { IReview, IReviewModel } from './../interface/IReview';
import mongoose from 'mongoose';
import { Product } from './ProductsModel';

const ReviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review cannot be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

//* unique
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'firstName lastName photo',
  });
  next();
});

ReviewSchema.statics.calcAverageRatings = async function (productId: string) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        numberOfRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingQuantity: stats[0].numberOfRating ?? 0,
    ratingsAveraged: stats[0].averageRating ?? 0,
  });
};

ReviewSchema.post('save', async function () {
  Review.calcAverageRatings(this.product);
});

ReviewSchema.pre(/^findOneAnd/, async function (next: any) {
  Review.actualReview = await this.findOne();
  next();
});

ReviewSchema.post(/^findOneAnd/, async function () {
  await Review.actualReview.calcAverageRatings(Review.actualReview.product);
});

export const Review: IReviewModel = mongoose.model<IReview, IReviewModel>(
  'Review',
  ReviewSchema,
);
