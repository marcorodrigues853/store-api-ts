import { IUser } from './../interface/IUser';
import AuthService from '../services/AuthService';
import AppError from '../utilities/AppError';
import express from 'express';
import jwt from 'jsonwebtoken';

class AuthController {
  async register() {
    //
  }

  async login(req: express.Request, res: express.Response) {
    try {
      const foundUser = await AuthService.foundUser(req.body);
      if (!foundUser) new AppError(`User email not found`, 500);

      const isValidPassword = await AuthService.isValidPassword(
        req.body,
        foundUser,
      );

      if (!isValidPassword) new AppError('Password invalid', 500);
      const token = this.generateAccessToken(foundUser._id, foundUser.roles);
      return res.json({ token });
    } catch (error: unknown) {
      if (error instanceof Error) new AppError(error.message, error.code);
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
}

export default new AuthController();
