import { IReview, IReviewModel } from './../interface/IReview';
import mongoose from 'mongoose';
import { Product } from './ProductsModel';
import { stat } from 'fs';

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

ReviewSchema.index({ product: 1, user: 1 });

ReviewSchema.pre(/^find/, function (next) {
  //*  this  does like a join query and  get has reference the field in colecction that inside has ref: of the model
  // this.populate({ path: 'user', select: 'firstName lastName' }).populate({
  //   path: 'product',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'product',
    select: 'name photo',
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
  console.log(stats);
  await Product.findByIdAndUpdate(productId, {
    ratingQuantity: stats[0].numberOfRating,
    ratingsAveraged: stats[0].averageRating,
  });
};

ReviewSchema.post('save', async function () {
  Review.calcAverageRatings(this.product);
});

export const Review: IReviewModel = mongoose.model<IReview, IReviewModel>(
  'Review',
  ReviewSchema,
);
