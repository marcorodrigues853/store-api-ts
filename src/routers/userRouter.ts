import { Router } from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/authMiddleware';
import {
  resizeUserPhoto,
  uploadUserPhoto,
} from '../middleware/multerMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

router.route('/').get(roleMiddleware(['ADMIN']), UserController.getAll);

router
  .route('/:id')
  .get(UserController.getOne)
  .patch(
    roleMiddleware(['ADMIN']),
    uploadUserPhoto,
    resizeUserPhoto,
    UserController.updateOne,
  )
  .delete(roleMiddleware(['ADMIN']), UserController.deleteOne);

// router.patch(
//   '/updateMyPassword',
//   authMiddleware,
//   UserController.updatePassword,
// );

export default router;
