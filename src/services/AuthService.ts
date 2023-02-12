import { Role } from '../models/Roles';
import { User } from '../models/UsersModel';
import { IUser } from './../interface/IUser';
import { compareSync, hashSync } from 'bcryptjs';
import TokenService from './TokenService';
import AppError from '../utilities/AppError';

class AuthService {
  // async foundUser(user: IUser) {
  //   return await User.findOne({ email: user.email });
  // }

  async isValidPassword(user: IUser, foundUser: IUser) {
    return compareSync(user.password, foundUser.password);
  }

  async login(email: string, password: string) {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      throw new Error(`User ${email} not found`);
    }
    //* compare if passwords is the same
    const hasValidPassword = compareSync(password, foundUser.password);

    if (!hasValidPassword) throw new Error('Password invalid');

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

    const hasConfirmedPassword =
      JSON.stringify(newUser.password) ===
      JSON.stringify(newUser.passwordConfirm);

    if (!hasConfirmedPassword) throw new Error('Password not coiso');

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

  async forgotPassword(refreshToken: string) {
    //
  }
}

export default new AuthService();
