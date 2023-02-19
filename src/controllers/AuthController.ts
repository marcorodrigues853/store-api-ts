import { User } from './../models/UsersModel';
import AuthService from '../services/AuthService';
import AppError from '../utilities/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { validationResult } from 'express-validator';

import { hashSync } from 'bcryptjs';
import Email from '../utilities/Email';

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

      return res.status(201).json({ message: 'User created', ...createdUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json(error.message);
      }
      res.status(500).json('Registration failed. Try again.');
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const foundUser = await AuthService.login(email, password);

      res.cookie('refreshToken', foundUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json({ message: 'Login success', data: foundUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return next(new AppError(error.message, 400));
      }
    }
  }

  async logout(req: Request, res: Response) {
    try {
      if (!req.cookies.refreshToken)
        return res.status(400).json({ message: 'Refresh token not found' }); // TODO: add class

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
    try {
      if (!req.cookies.refreshToken) {
        return res.status(400).json({ message: 'Refresh token not found' });
      }
      const { refreshToken } = req.cookies;

      const foundUser = await AuthService.refresh(refreshToken);
      res.cookie('refreshToken', foundUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(foundUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      res.status(500).json('Refresh token failed');
    }
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

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    // 1) get user of posted email
    const { email } = req.body;
    if (!email) next(new AppError('Email is invalid.', 404));

    // TODO: need to do a service
    const foundUser = await User.findOne({ email });

    try {
      if (!foundUser) return next(new AppError('Email is invalid.', 404));
      // 2) Generate the random reset token
      const resetToken = await foundUser?.createPasswordResetToken();
      await foundUser.save({ validateBeforeSave: false }); // to avoid  validators

      // 3) Send it to user's email
      const resetURL = `${process.env.API_URL}/auth/resetPassword/${resetToken}`;
      await new Email(foundUser, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (error) {
      // TODO: define error
      // clause guard to reset token to prevent security breaches
      if (foundUser) {
        foundUser.passwordResetToken = undefined;
        foundUser.passwordResetExpires = undefined;
        await foundUser.save({ validateBeforeSave: false });
      }

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500,
        ),
      );
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    //* 1) Get user based on the token
    const { token } = req.params;

    //* 2) if token has not expired, and there is user, set the new password
    const foundUser = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!foundUser)
      return res.status(400).json({
        status: 'Bad Request',
        message: 'Token is invalid or not found',
      });
    //return next(new AppError('Token is invalid or has expired', 400));

    //* 3) Update changePasswordAt property for the user

    const { newPassword, newPasswordConfirm } = req.body;

    const hasConfirmedPassword = newPassword === newPasswordConfirm;
    if (!hasConfirmedPassword) throw new AppError('Password not match.', 422);

    const hashedPassword = hashSync(req.body.password);
    foundUser.password = hashedPassword;
    foundUser.passwordConfirm = hashedPassword;
    foundUser.passwordResetExpires = undefined;
    foundUser.passwordResetToken = undefined;
    await foundUser.save();

    //* 4) Log the user in, send JWT to the client
    const { email } = foundUser;
    const authToken = await AuthService.login(email, req.body.password);

    return res.status(200).json({
      status: 200,
      message: 'Password changed with success',
      data: authToken,
    });
  }

  async activateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { token: refreshToken } = req.params;
      await AuthService.activateAccount(refreshToken);
      res.status(200).json({
        message: 'Account activated',
      });
    } catch (error) {
      next(new AppError('Invalid or expired token', 400));
    }
  }
}

export default new AuthController();
