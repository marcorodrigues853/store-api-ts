import { IReview } from './../interface/IReview';
import mongoose from 'mongoose';

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

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
