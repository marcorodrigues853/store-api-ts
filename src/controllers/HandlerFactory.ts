import { mongoose, Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utilities/AppError';

export const createOne = (Model: Model<unknown>) => {
  async (req: Request, res: Response) => {
    const response = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: response,
      },
    });
  };
};

export const deleteOne = (Model: Model<unknown>) => {
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Model.findByIdAndDelete(req.params.id);

    if (!result) {
      return next(new AppError('No results found', 404));
    }
    res.status(204).json({ status: 'success', data: null });
  };
};
