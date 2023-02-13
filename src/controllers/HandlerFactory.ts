import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utilities/AppError';
import APIFilters from '../utilities/APIFilters';

export const createOne = (Model: Model<unknown>) => {
  async (req: Request, res: Response) => {
    const response = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: response,
      },
      requestedAt: new Date(Date.now()).toUTCString(),
    });
  };
};

export const deleteOne = (Model: Model<unknown>) => {
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await Model.findByIdAndDelete(req.params.id);

    if (!result) next(new AppError('No results found', 404));

    res.status(204).json({
      status: 'success',
      data: result,
      requestedAt: new Date(Date.now()).toUTCString(),
    });
  };
};

export const updateOne =
  (Model: Model<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!response) next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: response,
      },
      requestedAt: new Date(Date.now()).toUTCString(),
    });
  };

export const getOne =
  (Model: Model<unknown>, popOptions: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const response = await query;

    if (!response) next(new AppError('No document found with that ID', 404));

    res.status(200).json({
      status: 'success',
      data: {
        data: response,
      },
      requestedAt: new Date(Date.now()).toUTCString(),
    });
  };

export const getAll =
  (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
    console.log('akiiiiiiiii');
    const filters = new APIFilters(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const response = await filters.query;

    res.status(200).json({
      status: 'success',
      results: response.length,
      data: response,
      requestedAt: new Date(Date.now()).toUTCString(),
    });
  };

export default { getAll, getOne, deleteOne, createOne, updateOne };
