import mongoose from 'mongoose';
import { IProduct } from '../interface/IProducts';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      max: 200,
    },
    price: { type: Number, required: true, trim: true, min: 1 },
    taxID: { type: String, ref: 'Taxes' },
    photos: {
      thumbnails: { type: Array },
    },
    ratingsAveraged: { type: Number, default: 0 },
    // ratings: { ref: 'Ratings' },
    ratings: {},
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
