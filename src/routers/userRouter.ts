import { Router } from 'express';

import UserController from '../controllers/UserController';

const router = Router();

router.route('/users').get(UserController.getAll).put(UserController.updateOne);

router
  .route('/users/:id')
  .get(UserController.getOne)
  .delete(UserController.deleteOne);

export default router;
