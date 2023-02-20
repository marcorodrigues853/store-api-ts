import { Request, Response, NextFunction } from 'express';
import { User } from '../models/UsersModel';
import UserService from '../services/UserService';
import factory from './HandlerFactory';
import AppError from '../exceptions/AppError';
import FactoryCRUDController from './FactoryCRUDController';

class UserController {
  async getAll2() {
    await new FactoryCRUDController(User).getAll;
  }
  async getUser() {
    await factory.getAll(User);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) new AppError('Please pass an  product id.', 400);
      const user = await UserService.getOne(req.params.id);

      return res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
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
        next(error);
      }
    }
  }

  async updateOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.update(id, req.body);
      res.status(201).json({ status: 'success', data: user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error instanceof Error) {
          next(error);
        }
      }
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) new AppError('ID not exists', 404);

      const deleted = await UserService.deleteOne(id);
      if (!deleted) new AppError('Nothing to delete', 204);

      return res.status(201).json(deleted);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }
}

export default new UserController();
