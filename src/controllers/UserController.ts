import { Request, Response } from 'express';
import { User } from '../models/UsersModel';
import UserService from '../services/UserService';
import factory from './HandlerFactory';
import AppError from '../utilities/AppError';

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
}

export default new UserController();
