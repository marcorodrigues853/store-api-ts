import { Product } from '../models/ProductsModel';
import { IProduct } from './../interface/IProducts';
import AppError from '../utilities/AppError';

import { createOne } from './../controllers/HandlerFactory';
class ProductService {
  async create(product: IProduct) {
    const newProduct = await Product.create(product);
    return newProduct;
  }
  async getAll() {
    const allProducts = await Product.find();
    return allProducts;
  }
  async getOne(id: string) {
    if (!id) new AppError('Please pass an  product id.', 422);

    const product = await Product.findById(id);
    return product;
  }
  async delete() {}
  async update() {}
}
// const createProductAlex = factory.createOne(ProductAlex);
// const getProductAlex = factory.getOne(ProductAlex);
// const getAllProductAlex = factory.getAll(ProductAlex);
// const updateProductAlex = factory.updateOne(ProductAlex);
// const deleteProductAlex = factory.deleteOne(ProductAlex);

export default new ProductService();
