import mongoose from 'mongoose';
import { ITour } from '../interface/ITour';

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
  },
  { timestamps: true },
);

export const Tour = mongoose.model<ITour>('Tour', TourSchema);
