import { Router } from 'express';
import ReviewController from '../controllers/ReviewController';

import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router
  .route('/')
  .get(ReviewController.getAll)
  .post(authMiddleware, ReviewController.createOne);

export default router;
