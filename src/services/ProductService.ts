import { Product } from '../models/ProductsModel';
import { IProduct } from './../interface/IProducts';
import AppError from '../exceptions/AppError';
import APIFilters from '../utilities/APIFilters';

import factory from '../controllers/HandlerFactory';
class ProductService {
  async create(product: IProduct) {
    const newProduct = await Product.create(product);
    return newProduct;
  }
  async getAll(queryObject: any) {
    const filters = new APIFilters(Product.find(), queryObject)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products: IProduct[] = await filters.query;
    return products;
  }
  async getOne(id: string) {
    if (!id) new AppError('Please pass an  product id.', 422);

    const product = await Product.findById(id).populate('reviews');
    return product;
  }
  async update(id: string, product: IProduct) {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    if (!updatedProduct) {
      throw new Error('Product not found.');
    }
    return updatedProduct;
  }

  async deleteOne(id: string) {
    console.log('ID', id);
    const deleted = await Product.findByIdAndDelete(id);
    return deleted;
  }
}

export default new ProductService();
