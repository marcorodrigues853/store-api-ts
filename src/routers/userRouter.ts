import { Router } from 'express';

import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router
  .route('/users')
  .get(authMiddleware, UserController.getAll)
  .put(UserController.updateOne);

router
  .route('/users/:id')
  .get(authMiddleware, UserController.getOne)
  .delete(UserController.deleteOne);

// router.patch(
//   '/updateMyPassword',
//   authMiddleware,
//   UserController.updatePassword,
// );

export default router;
