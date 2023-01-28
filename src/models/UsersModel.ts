import mongoose from 'mongoose';
import { IUser } from '../interface/IUser';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user must have an first name'],
    min: 3,
    max: 30,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'A user must have an last name'],
    min: 3,
    max: 30,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    min: 6,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'A user must have an password'],
    min: 8,
    max: 80,
  },
  phone: {
    type: Number,
    required: [true, 'A user must have a phone number'],
    min: 5,
    max: 30,
    trim: true,
  },
  image: { type: String, required: [true, 'A user must have an photo'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
