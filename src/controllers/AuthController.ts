import { User } from './../models/UsersModel';
import AuthService from '../services/AuthService';
import AppError from '../utilities/AppError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { validationResult } from 'express-validator';
import Email from '../utilities/Email';
import { compareSync, hashSync } from 'bcryptjs';

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

      return res.json({ message: 'Login success', data: foundUser });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        return next(new AppError('Falhaste o login com sucesso', 500));
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
    // const user = await UserService.getOne(); // TODO: review with ALEX service once id  vs email
    const { email } = req.body;
    const foundUser = await User.findOne({ email });

    if (!foundUser) next(new AppError('Email is invalid.', 404));

    // 2) Generate the random reset token
    const resetToken = await foundUser?.createPasswordResetToken();

    try {
      await foundUser?.save({ validateBeforeSave: false }); // to avoid  validators

      // 3) Send it to user's email
      const resetURL = `${req.protocol}://${req.get(
        'host',
      )}/auth/resetPassword/${resetToken}`;

      const to = 'marcoaurelio853@gmail.com';
      const subject = 'Tests Alex project';
      const message = `Link to reset password ${resetURL}`;

      await Email.sendEmail(to, subject, message);
      console.log('enbiou mail');

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
        await foundUser?.save({ validateBeforeSave: false });
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
    // const hashedToken = await bcrypt.hashSync(token, 7);

    // const isTrue = compareSync(token, hashedToken);
    // console.log('isTrue: ', isTrue);
    // console.log('hashedToken', hashedToken);

    //* 2) if token has not expired, and there is user, set the new password
    const foundUser = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!foundUser)
      res.status(400).json({
        status: 'Bad Request',
        message: 'Token is invalid or not found',
      });
    //return next(new AppError('Token is invalid or has expired', 400));

    //* 3) Update changePasswordAt property for the user

    let authToken;
    if (foundUser) {
      const hashedPassword = hashSync(req.body.password);
      foundUser.password = hashedPassword;
      foundUser.passwordConfirm = hashedPassword;
      foundUser.passwordResetExpires = undefined;
      foundUser.passwordResetToken = undefined;
      await foundUser.save();

      //* 4) Log the user in, send JWT to the client
      const { email, password } = foundUser;
      console.log(email, password, req.body.password);
      authToken = await AuthService.login(email, req.body.password);
    }

    return res.status(200).json({
      status: 200,
      message: 'Password changed with success',
      data: authToken,
    });
  }
}

export default new AuthController();
