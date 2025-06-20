import { Router } from 'express';
import ReviewController from '../controllers/ReviewController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router({ mergeParams: true }); //* merge params to receive the  params from router before

router
  .route('/')
  .get(ReviewController.getAll)
  .post(authMiddleware, ReviewController.createOne);

router
  .route('/:id')
  .patch(ReviewController.updateOne)
  .delete(ReviewController.deleteOne);

export default router;
