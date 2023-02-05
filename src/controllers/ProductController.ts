import { Request, Response } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
  async create(req: Request, res: Response) {
    try {
      console.log(req.body);
      const createProduct = await ProductService.create(req.body); // pass req.body
      res.status(200).json(createProduct);
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
