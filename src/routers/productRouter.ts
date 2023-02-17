import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import factory from '../controllers/HandlerFactory';
import { Product } from '../models/ProductsModel';
import authMiddleware from '../middleware/authMiddleware';

import reviewRouter from '../routers/reviewRouter';

const router = Router();

//* if has param in route this middleware will be executed else will be ignored
// router.param('id', ProductController.checkID); // TODO: need to review

router.use('/products/:id/reviews', reviewRouter); //* mounting a router

router
  .route('/products')
  .get(factory.getAll(Product))

  // .get(ProductController.getAll)
  .post(authMiddleware, ProductController.create)
  .put(ProductController.update);

router
  .route('/products/:id')
  .get(ProductController.getOne)
  .delete(ProductController.deleteOne)
  .patch(ProductController.update);

export default router;
