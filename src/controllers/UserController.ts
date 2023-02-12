import { NextFunction, Request, Response } from 'express';
import { User } from '../models/UsersModel';
import UserService from '../services/UserService';
import factory from './HandlerFactory';
import AppError from '../utilities/AppError';
import AuthService from '../services/AuthService';

class UserController {
  async getUser() {
    console.log('entrou');
    console.log(User);
    await factory.getAll(User);
  }

  async getOne(req: Request, res: Response) {
    try {
      if (!req.params.id) new AppError('Please pass an  product id.', 400);
      const user = await UserService.getOne(req.params.id);

      return res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async getAll(req: Request, res: Response) {
    //
    const queryObject = { ...req.query };
    const allUsers = await UserService.getAll(queryObject);
    res.status(200).json({
      status: 'success',
      results: allUsers.length,
      data: allUsers,
    });
    try {
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async updateOne() {
    //
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) new AppError('ID not exists', 404);

      const deleted = await UserService.deleteOne(id);
      if (!deleted) new AppError('já foste oh Candido', 204);

      console.log('deleted: ', deleted);
      return res.status(201).json(deleted);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  // async updatePassword(req: Request, res: Response, next: NextFunction) {
  //   // 1) get user from collection
  //   const foundUser = await User.findById(req.user.id).select('+password');

  //   // 2) Check if POSTed current password is correct
  //   const { passwordCurrent } = req.body;
  //   if (!foundUser?.hasCorrectPassword(passwordCurrent, foundUser.password)) {
  //     return next(
  //       new AppError('Your current password is wrong. Please try again', 401),
  //     );
  //   }

  //   // 3) If so, update password
  //   foundUser.password = req.body.password;
  //   foundUser.passwordConfirm = req.body.passwordConfirm;
  //   await foundUser.save();

  //   // 4) Log user in, send jwt
  //   // TODO: need to be reviewed once is repeated
  //   const authToken = await AuthService.login(
  //     foundUser.email,
  //     req.body.password,
  //   );
  //   return res.status(200).json({
  //     status: 200,
  //     message: 'Password changed with success',
  //     token: authToken,
  //   });
  // }
}

export default new UserController();
