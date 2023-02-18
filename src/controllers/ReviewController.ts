import { Request, Response, NextFunction } from 'express';
import ReviewService from '../services/ReviewService';
import AppError from '../utilities/AppError';

interface RequestWithUser extends Request {
  user: any;
}

class Review {
  async deleteOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) new AppError('ID not provided', 404);

      const deleted = await ReviewService.deleteOne(id);
      if (!deleted) new AppError(`Cant't delete`, 200);

      return res.status(200).json(deleted);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async updateOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ReviewService.update(id, req.body);
      res.status(201).json({ status: 'success', data: product });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({
          message: 'Failed to update review.',
          error,
        });
      }
    }
  }

  async getAll(req: Request, res: Response) {
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
      if (error instanceof Error) {
        res.status(422).json({
          status: 'error',
          error: error.message,
        });
      }
    }
  }

  async createOne(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.body.product) req.body.product = req.params.id;
      console.log('REQ:', req.body); // TODO: need to be reviewed with Alex Ageev
      if (!req.body.user) req.body.user = req.user.id;

      const newReview = await ReviewService.create(req.body);
      console.log('newReview:', newReview);
      res.status(200).json({
        status: 'success',
        data: {
          review: newReview,
        },
      });
      next();
    } catch (error) {
      res.status(422).json({
        status: 'error',
        error,
      });
    }
  }
}
export default new Review();
