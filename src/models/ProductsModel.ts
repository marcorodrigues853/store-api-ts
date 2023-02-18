import mongoose from 'mongoose';
import { IProduct } from '../interface/IProducts';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      min: 3,
      max: 30,
    },
    description: {
      type: String,
      required: [true, 'A description is required'],
      trim: true,
      min: 5,
      max: 200,
    },
    price: {
      type: Number,
      required: [true, 'A price is required'],
      trim: true,
      min: 1,
    },
    taxID: { type: String, ref: 'Taxes' },
    images: {
      thumbnails: { type: Array, required: true, max: 2 },
      big: { type: Array, required: true, max: 2 },
    },

    ratingQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAveraged: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be a number equal or above 1'],
      max: [5, 'Rating must be a number equal or below 5'],
      set: (value: number) => value.toFixed(1),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

ProductSchema.index({ price: 1, ratingsAveraged: -1 });

//* Virtual populate to connect to fields
ProductSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
