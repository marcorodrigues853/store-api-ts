import { Product } from '../models/ProductsModel';
import { IProduct } from './../interface/IProducts';
import AppError from '../utilities/AppError';
import APIFilters from '../utilities/APIFilters';
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

    const product = await Product.findById(id);
    return product;
  }
  async update() {
    //
  }
}
// const createProductAlex = factory.createOne(ProductAlex);
// const createUserAlex = factory.createOne(UsertAlex);
// const getProductAlex = factory.getOne(ProductAlex);
// const getAllProductAlex = factory.getAll(ProductAlex);
// const updateProductAlex = factory.updateOne(ProductAlex);
// const deleteProductAlex = factory.deleteOne(ProductAlex);

export default new ProductService();
