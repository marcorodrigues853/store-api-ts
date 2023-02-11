export interface IUser {
  id?: number;
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
}
