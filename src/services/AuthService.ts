import { Role } from '../models/Roles';
import { User } from '../models/UsersModel';
import { IUser } from './../interface/IUser';
import { compareSync, hashSync } from 'bcryptjs';
import TokenService from './TokenService';
import AppError from '../utilities/AppError';
import { Hash } from 'crypto';
import Email2 from '../utilities/Email2';

class AuthService {
  async isValidPassword(password: string, newPassword: string) {
    return compareSync(password, newPassword);
  }

  async login(email: string, password: string) {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      throw new Error(`User ${email} not found`);
    }
    //* compare if passwords is the same
    const hasValidPassword = this.isValidPassword(password, foundUser.password);

    if (!hasValidPassword) throw new Error('Password invalid');

    const tokens = TokenService.generateTokens(foundUser);
    await TokenService.saveToken(String(foundUser._id), tokens.refreshToken);
    return {
      ...tokens,
      foundUser,
    };
  }

  async register(newUser: IUser): Promise<any> {
    const { email, password, passwordConfirm } = newUser;
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new AppError('User already exists.', 401);
    }

    const hasConfirmedPassword = password === passwordConfirm;
    if (!hasConfirmedPassword) throw new AppError('Password not match.', 422);

    const hashPassword = hashSync(newUser.password, 7);

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

      await new Email2(newUser).sendWelcome();

      await TokenService.saveToken(
        String(createdUser._id),
        tokens.refreshToken,
      );
      return { ...tokens, createdUser };
    } else {
      console.log('Role not found');
    }
  }

  async logout(refreshToken: string) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      new AppError('Refresh token not found', 404);
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      new AppError('Invalid refresh token', 401);
    }

    const foundUser = await User.findById(userData?.id);
    console.log(foundUser);
    const tokens = TokenService.generateTokens(foundUser);
    await TokenService.saveToken(String(userData?.id), tokens.refreshToken);

    return {
      ...tokens,
      foundUser,
    };
  }
}

export default new AuthService();
