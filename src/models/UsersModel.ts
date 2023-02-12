import { randomUUID } from 'crypto';
import { hashSync } from 'bcryptjs';
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
    photo: { type: String },
    passwordChangedAt: { type: Date },
    passwordResetExpires: { type: Date },
    passwordResetToken: { type: String },
  },
  { timestamps: true },
);
// console.log('SCHEMA1', UserSchema);
UserSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.createPasswordResetToken = async function () {
  console.log('hiiii inbside');
  const resetToken = randomUUID(); // uuid v4
  this.passwordResetToken = await hashSync(resetToken, 7); // TODO: need to be reviewed with Alex Ageev
  this.passwordResetToken = resetToken; // did once encrypted token has different when i use   hashsync
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10m
  console.log('expires :', Date.now() + 10 * 60 * 1000);

  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

// console.log('SCHEMA2', UserSchema.methods.createPasswordResetToken);
export const User = mongoose.model<IUser & mongoose.Document>(
  'User',
  UserSchema,
);
