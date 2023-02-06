import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
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
        data: [createProduct],
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
      res.status(200).json(allProducts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const product = await ProductService.getOne(req.params.id);
      return res.status(200).json(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }
}

export default new ProductController();
