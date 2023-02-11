import AuthService from '../services/AuthService';
import AppError from '../utilities/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/UsersModel';
import { IUser } from '../interface/IUser';
import { validationResult } from 'express-validator';
import UserService from '../services/UserService';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(500)
          .json({ message: 'Error during registration.', errors });
      }

      const newUser = req.body;
      const createdUser = await AuthService.register(newUser);

      res.cookie('refreshToken', createdUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true para https
      });

      return res.status(201).json({ message: 'User created', createdUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      res.status(500).json('Registration failed. Try again.');
    }
  }

  // async login(req: express.Request, res: express.Response) {
  //   try {
  //     console.log('AKI: ', req.body);
  //     const foundUser: any = await AuthService.foundUser(req.body);

  //     if (!foundUser) new AppError(`User email not found`, 500);

  //     const isValidPassword = await AuthService.isValidPassword(
  //       req.body,
  //       foundUser,
  //     );

  //     if (!isValidPassword) new AppError('Password invalid', 500);
  //     const token = this.generateAccessToken(foundUser._id, foundUser.roles);
  //     return res.json({ token });
  //   } catch (error: unknown) {
  //     if (error instanceof Error) new AppError(error.message, 500);
  //   }
  // }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const foundUser = await AuthService.login(email, password);

      res.cookie('refreshToken', foundUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ message: 'Login success', foundUser });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
        return next(new AppError('Falhaste o lgin com sucesso', 500));
      }
      res.status(500).json('Login failed');
    }
  }

  async logout(req: Request, res: Response) {
    try {
      if (!req.cookies.refreshToken)
        res.status(400).json({ message: 'Refresh token not found' }); // TODO: add class

      const { refreshToken } = req.cookies;
      const token = await AuthService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json(token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message); // TODO: add class
      }
      res.status(500).json('Logout failed');
    }
  }

  async refresh(req: Request, res: Response) {
    //
  }

  generateAccessToken = (id: string, roles: string[]) => {
    const payload = {
      id,
      roles,
    };

    return jwt.sign(payload, String(process.env.SECRET_KEY), {
      expiresIn: '24h',
    });
  };

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    //! 1) get user of posted email

    // const user = await UserService.getOne(); // TODO: review with ALEX service once id  vs email
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) next(new AppError('Email is invalid.', 404));
    //! 2) Generate the random reset token

    // const resetToken = user.createPasswordResetToken(); // need to be created in userModel
    // user.save({ validateBeforeSave: false }); // to avoid  validators

    //! 3) Send it to user's email
  }
  async resetPassword(req: Request, res: Response) {
    //
  }
}

export default new AuthController();
