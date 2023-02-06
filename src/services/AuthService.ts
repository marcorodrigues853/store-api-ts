import { Role } from '../models/Roles';
import { User } from '../models/UsersModel';
import { IUser } from './../interface/IUser';
import bcrypt from 'bcryptjs';
import TokenService from './TokenService';
import AppError from '../utilities/AppError';

class AuthService {
  async foundUser(user: IUser) {
    console.log('USER: ', user);
    return await User.findOne({ email: user.email });
  }

  async isValidPassword(user: IUser, foundUser: IUser) {
    return bcrypt.compareSync(user.password, foundUser.password);
  }

  async login(username: string, password: string) {
    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      throw new Error('User ${username} not found');
    }
    //* compare if passwords is the same
    const hasValidPassword = bcrypt.compareSync(password, foundUser.password);

    if (!hasValidPassword) new AppError('Invalid Password', 409);

    const tokens = TokenService.generateTokens(foundUser);
    await TokenService.saveToken(String(foundUser._id), tokens.refreshToken);
    return {
      ...tokens,
      foundUser,
    };
  }

  async register(newUser: IUser): Promise<any> {
    const candidate = await User.findOne({ email: newUser.email });
    if (candidate) {
      //TODO: need to check throw ApiError.BadRequest('User already exists.');
    }

    const hashPassword = bcrypt.hashSync(newUser.password, 7);
    const hasConfirmedPassword =
      JSON.stringify(newUser.password) ===
      JSON.stringify(newUser.passwordConfirm);

    if (!hasConfirmedPassword) throw new Error('Password not coiso');
    const userRole = await Role.findOne({ value: 'USER' });

    if (userRole) {
      const user = new User({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: hashPassword, //* encrypted password with bcrypt
        passwordConfirm: hashPassword,
        roles: [userRole.value],
      });

      const createdUser = await user.save();
      const tokens = TokenService.generateTokens(createdUser);
      await TokenService.saveToken(
        String(createdUser._id),
        tokens.refreshToken,
      );
      return { ...tokens, createdUser };
    } else {
      console.log('Role not found');
    }
  }
}

export default new AuthService();
