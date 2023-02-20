import { Request, Response, NextFunction } from 'express';
import AppError from '../exceptions/AppError';

import FactoryCRUDService from '../services/FactoryCRUDService';

class FactoryCRUDController {
  Model: any;
  popOptions: any;
  service: any;

  constructor(Model: any, popOptions = null) {
    this.Model = Model;
    this.service = new FactoryCRUDService(Model);

    if (popOptions) this.popOptions = popOptions;
  }

  createOne() {
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await this.service.create();
      if (!response) next(new AppError('3333', 333));
      // const response = await this.Model.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          data: response,
        },
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    };
  }

  deleteOne() {
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.service.deleteOne(req.params.id);

      if (!result) next(new AppError('No results found', 404));

      res.status(204).json({
        status: 'success',
        data: result,
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    };
  }

  updateOne() {
    async (req: Request, res: Response, next: NextFunction) => {
      const response = await this.Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!response) next(new AppError('No document found with that ID', 404));

      res.status(200).json({
        status: 'success',
        data: {
          data: response,
        },
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    };
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    // let query = Model.findById(req.params.id);
    const response = await this.service.getOne(req.params.id);
    if (!response) next(new AppError('No document found with that ID', 404));
    res.status(200).json({
      status: 'success',
      data: {
        data: response,
      },
      requestedAt: new Date(Date.now()).toUTCString(),
    });
  }

  async getAll(req: Request, res: Response) {
    try {
      console.log('entrou getALL CRUD');
      const response = this.service.getAll(req.query);

      return res.status(200).json({
        status: 'success',
        results: response.length,
        data: {
          response,
        },
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        data: {
          error,
        },
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    }
  }
}
export default FactoryCRUDController;

// export const getOne =
//   (Model: Model<unknown>, popOptions: any) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     let query = Model.findById(req.params.id);
//     if (popOptions) query = query.populate(popOptions);
//     const response = await query;

//     if (!response) next(new AppError('No document found with that ID', 404));

//     res.status(200).json({
//       status: 'success',
//       data: {
//         data: response,
//       },
//       requestedAt: new Date(Date.now()).toUTCString(),
//     });
//   };

// export const getAll =
//   (Model: any) => async (req: Request, res: Response, next: NextFunction) => {
//     console.log('akiiiiiiiii');
//     const filters = new APIFilters(Model.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();

//     const response = await filters.query;

//     res.status(200).json({
//       status: 'success',
//       results: response.length,
//       data: {
//         data: response,
//       },
//       requestedAt: new Date(Date.now()).toUTCString(),
//     });
//   };

// export default { getAll, getOne, deleteOne, createOne, updateOne };
