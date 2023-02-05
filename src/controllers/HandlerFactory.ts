import { mongoose, Model } from 'mongoose';
import { Request, Response } from 'express';

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
