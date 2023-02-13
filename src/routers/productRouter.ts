import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import factory from '../controllers/HandlerFactory';
import { Product } from '../models/ProductsModel';
import authMiddleware from '../middleware/authMiddleware';
import ReviewController from '../controllers/ReviewController';

const router = Router();

// if has param in route this middleware will be executed else will be ignored
router.param('id', ProductController.checkID); // TODO: need to review

router
  .route('/products')
  .get(factory.getAll(Product))

  // .get(ProductController.getAll)
  .post(authMiddleware, ProductController.create)
  .put(ProductController.update);

router
  .route('/products/:id')
  .get(ProductController.getOne)
  .delete(ProductController.deleteOne);

router
  .route('/products/:id/reviews')
  .post(authMiddleware, ReviewController.createOne);

export default router;
