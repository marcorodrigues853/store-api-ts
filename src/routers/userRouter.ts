import { Router } from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';
import {
  resizeUserPhoto,
  uploadUserPhoto,
} from '../middleware/multerMiddleware';

const router = Router();

router.use(authMiddleware);

router.route('/').get(UserController.getAll).put(UserController.updateOne);

router
  .route('/:id')
  .get(UserController.getOne)
  .patch(uploadUserPhoto, resizeUserPhoto, UserController.updateOne)
  .delete(UserController.deleteOne);

// router.patch(
//   '/updateMyPassword',
//   authMiddleware,
//   UserController.updatePassword,
// );

export default router;
