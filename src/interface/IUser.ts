export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isActive: boolean;
  photo: string
  createdAt: Date
  updatedAt: Date
}
