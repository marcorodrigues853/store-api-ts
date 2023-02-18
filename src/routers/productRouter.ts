import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import factory from '../controllers/HandlerFactory';
import { Product } from '../models/ProductsModel';
import { resizeImages, uploadImages } from '../middleware/multerMiddleware';
import reviewRouter from '../routers/reviewRouter';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use('/:id/reviews', reviewRouter); //* mounting a router

router
  .route('/')
  .get(factory.getAll(Product))
  // .get(ProductController.getAll)
  .post(authMiddleware, uploadImages, resizeImages, ProductController.create);

router
  .route('/:id')
  .get(ProductController.getOne)
  .delete(authMiddleware, ProductController.deleteOne)
  .patch(authMiddleware, uploadImages, resizeImages, ProductController.update);

export default router;
