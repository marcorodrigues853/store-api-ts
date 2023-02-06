import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import ProductService from '../services/ProductService';

const router = Router();

// if has param in route this middleware will be executed else will be ignored
router.param('id', ProductController.checkID); // TODO: need to review

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
