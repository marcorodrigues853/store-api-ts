import { Request, Response } from 'express';
import ReviewService from '../services/ReviewService';

interface RequestWithUser extends Request {
  user: any;
}

class Review {
  async getAll(req: Request, res: Response) {
    try {
      let filter = {};

      if (req.params.id) filter = { product: req.params.id };
      const reviews = await ReviewService.getAll(filter);
      // pass to service

      res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
          reviews,
        },
      });
    } catch (error) {
      res.status(422).json({
        status: 'error',
        error,
      });
    }
  }

  async createOne(req: any, res: Response) {
    try {
      if (!req.body.product) req.body.product = req.params.id;
      console.log('REQ:', req); // TODO: need to be reviewed with Alex Ageev
      if (!req.body.user) req.body.user = req.user.id;

      const newReview = await ReviewService.create(req.body);
      res.status(200).json({
        status: 'success',
        data: {
          review: newReview,
        },
      });
    } catch (error) {
      res.status(422).json({
        status: 'error',
        error,
      });
    }
  }
}
export default new Review();
