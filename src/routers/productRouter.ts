import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const router = Router();

router
  .route('/products')
  .get(ProductController.getAll)
  .post(ProductController.create)
  .put(ProductController.update);

router
  .route('/products/:id')
  .get(ProductController.getOne)
  .delete(ProductController.delete);

export default router;
