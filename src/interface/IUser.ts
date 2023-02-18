import { ObjectId } from 'mongoose';

export interface IUser {
  id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  phone: string;
  isActive: boolean;
  photo: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  createPasswordResetToken: () => string;
  hasCorrectPassword: (
    candidatePassword: string,
    userPassword: string,
  ) => boolean;
}
