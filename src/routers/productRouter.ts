import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import factory from '../controllers/HandlerFactory';
import { Product } from '../models/ProductsModel';
import authMiddleware from '../middleware/authMiddleware';

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

export default router;
