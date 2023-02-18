import { Router } from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';
import {
  resizeUserPhoto,
  uploadUserPhoto,
} from '../middleware/multerMiddleware';

const router = Router();

router
  .route('/')
  .get(authMiddleware, UserController.getAll)
  .put(authMiddleware, UserController.updateOne);

router
  .route('/:id')
  .get(authMiddleware, UserController.getOne)
  .patch(
    authMiddleware,
    uploadUserPhoto,
    resizeUserPhoto,
    UserController.updateOne,
  )
  .delete(authMiddleware, UserController.deleteOne);

// router.patch(
//   '/updateMyPassword',
//   authMiddleware,
//   UserController.updatePassword,
// );

export default router;
