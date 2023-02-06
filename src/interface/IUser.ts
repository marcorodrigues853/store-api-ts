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
  createdAt: Date;
  updatedAt: Date;
}
