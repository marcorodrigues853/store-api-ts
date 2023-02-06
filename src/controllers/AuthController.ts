import AuthService from '../services/AuthService';
import AppError from '../utilities/AppError';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/UsersModel';
import { IUser } from '../interface/IUser';
import { validationResult } from 'express-validator';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      console.log('errors: ', errors);
      console.log('AKI caralho');
      if (!errors.isEmpty()) {
        return res
          .status(500)
          .json({ message: 'Error during registration.', errors });
      }
      console.log('body', req.body);

      const newUser = req.body;

      console.log(200, newUser, "I'm here");

      const createdUser = await AuthService.register(newUser);

      res.cookie('refreshToken', createdUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true caso esteijam usar https
      });

      return res.json({ message: 'User created', createdUser });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
      }
      res.status(500).json('Registration failed.');
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

  async login(req: express.Request, res: express.Response) {
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
      }
      res.status(500).json('Login failed');
    }
  }

  async logout() {
    //
  }
  async refresh() {
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
}

export default new AuthController();
