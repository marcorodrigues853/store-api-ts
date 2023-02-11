import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/ProductService';
import AppError from '../utilities/AppError';
import { Product } from '../models/ProductsModel';
import HandlerFactory from './HandlerFactory';

class ProductController {
  // factory: any;

  // constructor() {
  //   const model = Product;
  //   this.factory = new HandlerFactory(model);
  // }

  checkID(req: Request, res: Response, next: NextFunction, val: any): void {
    console.log('val', val);

    //* clause guard that verify if has one ID
    if (val * 1 > 0)
      res.status(404).json({
        status: 'Fail',
        message: 'Invalid ID',
      });

    next();
  }

  async create(req: Request, res: Response) {
    try {
      const createProduct = await ProductService.create(req.body); // pass req.body
      res.status(201).json({
        status: 201,
        data: createProduct,
        requestedAt: new Date(Date.now()).toUTCString(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const queryObject = { ...req.query };
      const allProducts = await ProductService.getAll(queryObject);
      res.status(200).json({
        status: 'success',
        results: allProducts.length,
        data: allProducts,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) new AppError('ID not provided', 404);

      const product = await ProductService.getOne(id);
      return res.status(200).json(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async deleteOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) new AppError('ID not provided', 404);

      const deleted = await ProductService.deleteOne(id);
      if (!deleted) new AppError('já foste oh candido', 200);

      return res.status(200).json(deleted);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }
}

export default new ProductController();
