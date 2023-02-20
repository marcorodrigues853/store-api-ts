import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/ProductService';
import AppError from '../exceptions/AppError';

class ProductController {
  // factory: any;

  // constructor() {
  //   const model = Product;
  //   this.factory = new HandlerFactory(model);
  // }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createProduct = await ProductService.create(req.body); // pass req.body
      res.status(201).json({
        status: 201,
        data: createProduct,
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const queryObject = { ...req.query };
      const allProducts = await ProductService.getAll(queryObject);
      res.status(200).json({
        status: 'success',
        results: allProducts.length,
        data: allProducts,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) new AppError('ID not provided', 404);

      const product = await ProductService.getOne(id);
      return res.status(200).json(product);
    } catch (error: unknown) {
      next(error);
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) next(new AppError('ID not provided', 404));

      const deleted = await ProductService.deleteOne(id);
      if (!deleted) next(new AppError('já foste oh candido', 200));

      return res.status(200).json(deleted);
    } catch (error: unknown) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.update(id, req.body);
      res.status(201).json({ status: 'success', data: product });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new ProductController();
