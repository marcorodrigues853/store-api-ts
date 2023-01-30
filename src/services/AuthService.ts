import { User } from '../models/UsersModel';
import { IUser } from './../interface/IUser';
import bcrypt from 'bcryptjs';

class AuthService {
  async foundUser(user: IUser) {
    return await User.findOne({ username: user.email });
  }

  async isValidPassword(user: IUser, foundUser: IUser) {
    return bcrypt.compareSync(user.password, foundUser.password);
  }
}

export default new AuthService();
