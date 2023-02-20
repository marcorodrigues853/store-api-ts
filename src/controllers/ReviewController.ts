import { Request, Response, NextFunction } from 'express';
import ReviewService from '../services/ReviewService';
import AppError from '../exceptions/AppError';

class Review {
  async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) new AppError('ID not provided', 404);

      const deleted = await ReviewService.deleteOne(id);
      if (!deleted) new AppError(`Cant't delete`, 404);

      return res.status(200).json(deleted);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async updateOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ReviewService.update(id, req.body);
      res.status(201).json({ status: 'success', data: product });
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(error);
      }
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      let filter = {};

      if (req.params.id) filter = { product: req.params.id };
      const reviews = await ReviewService.getAll(filter);

      res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createOne(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.body.product) req.body.product = req.params.id;
      new AppError('No document found with that ID', 404);
      if (!req.body.user) req.body.user = req.user.id;

      const newReview = await ReviewService.create(req.body);
      res.status(200).json({
        status: 'success',
        data: {
          review: newReview,
        },
      });
    } catch (error) {
      console.log('EROOOO', error);
      if (error instanceof Error) {
        next(error);
      }
    }
  }
}
export default new Review();
