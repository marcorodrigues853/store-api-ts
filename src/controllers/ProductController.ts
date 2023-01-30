import { IProduct } from './../interface/IProducts';
import express from 'express';
import ProductService from '../services/ProductService';

class ProductController {
  async create(req: express.Request, res: express.Response) {
    try {
      const createProduct = await ProductService.create(req.body); // pass req.body
      res.status(200).json(createProduct);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async getAll(req: express.Request, res: express.Response) {
    try {
      const allProducts = await ProductService.getAll();
      res.status(200).json(allProducts);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async getOne(req: express.Request, res: express.Response) {
    try {
      const product = await ProductService.getOne(req.params.id);
      return res.status(200).json(product);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async delete(req: express.Request, res: express.Response) {
    try {
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }

  async update(req: express.Request, res: express.Response) {
    try {
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json(error.message);
      }
    }
  }
}

export default new ProductController();
