import { devNull } from 'os';
import { IUser } from './../interface/IUser';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
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
      unique: true,
      min: 6,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'A user must have an password'],
      min: 8,
      max: 80,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'A user must confirm your password'],
      min: 8,
      max: 80,
    },
    phone: {
      type: Number,
      required: false,
      min: 5,
      max: 30,
      trim: true,
    },
    photo: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    passwordResetExpires: { type: Date, required: false },
    passwordResetToken: { type: String, required: false },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', UserSchema);
