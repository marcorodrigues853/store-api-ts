import { randomUUID } from 'crypto';
import { compareSync } from 'bcryptjs';
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
      trim: true,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'A user must confirm your password'],
      min: 8,
      max: 80,
      trim: true,
      select: false,
    },
    roles: [{ type: String, ref: 'Role', default: 'USER' }],
    phone: {
      type: Number,
      required: false,
      min: 5,
      max: 30,
      trim: true,
    },
    photo: {
      type: String,
      default: 'not-found.jpg',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: { type: Date },
    passwordResetExpires: { type: Date },
    passwordResetToken: { type: String },
  },
  { timestamps: true },
);

// UserSchema.pre(/^find/, function (next) {
//   // this points to the current query
//   this.find({ isActive: { $ne: false } });
//   next();
// });

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) next();
  this.passwordChangedAt = new Date(Date.now()); //* to force TS once he recognize Date.now as a
  next();
});

UserSchema.methods.hasCorrectPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return compareSync(candidatePassword, userPassword);
};
UserSchema.methods.createPasswordResetToken = async function () {
  const resetToken = randomUUID(); // uuid v4
  this.passwordResetToken = resetToken; // did once encrypted token has different when i use   hashsync
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10m
  return resetToken;
};

export const User = mongoose.model<IUser & mongoose.Document>(
  'User',
  UserSchema,
);
