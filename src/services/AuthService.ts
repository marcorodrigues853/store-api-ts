import { Role } from '../models/Roles';
import { User } from '../models/UsersModel';
import { IUser } from './../interface/IUser';
import { compareSync, hashSync } from 'bcryptjs';
import TokenService from './TokenService';
import AppError from '../exceptions/AppError';
import Email from '../utilities/Email';
import UserService from './UserService';

class AuthService {
  async activateAccount(token: string) {
    try {
      const user = TokenService.validateRefreshToken(token);
      console.log('validated', user);
      const updatedUser = await UserService.update(user.id, { isActive: true });
      const { deletedCount } = await TokenService.removeToken(token);
      console.log('deletedCount', deletedCount);
      if (!deletedCount)
        throw new AppError('Invalid Token of activation.', 401);
      return updatedUser;
    } catch (error) {
      console.log(error);
      throw new AppError('Invalid Token of activation.', 401);
    }
  }
  isValidPassword(password: string, newPassword: string) {
    return compareSync(password, newPassword);
  }

  async login(email: string, password: string) {
    const foundUser = await User.findOne({ email });
    console.log('authLogin', foundUser);
    if (!foundUser) {
      throw new Error(`User ${email} not found!`);
    }

    console.log('!foundUser.isActive', !foundUser.isActive);
    console.log('!foundUser.isActive', foundUser);
    if (!foundUser.isActive) {
      throw new Error(`User ${email} active, consult your mail!`);
    }
    //* compare if passwords is the same

    const hasValidPassword = this.isValidPassword(password, foundUser.password);
    console.log(hasValidPassword);
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
      const tokens = TokenService.generateActivationAccountToken(
        createdUser._id,
      );
      await TokenService.saveToken(
        String(createdUser._id),
        tokens.refreshToken,
      );

      const activationLink = `${process.env.API_URL}/auth/activate/${tokens.refreshToken}`;
      await new Email(newUser, activationLink).sendWelcome();

      return { createdUser };
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
    const tokens = TokenService.generateTokens(foundUser);
    await TokenService.saveToken(String(userData?.id), tokens.refreshToken);

    return {
      ...tokens,
      foundUser,
    };
  }
}

export default new AuthService();
