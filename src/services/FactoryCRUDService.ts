import APIFilters from '../utilities/APIFilters';
import AppError from '../utilities/AppError';

class FactoryCRUDService {
  Model: any;
  constructor(Model: any) {
    this.Model = Model;
  }
  async create(object: any) {
    const newCreate = await this.Model.create(object);
    return newCreate;
  }
  async getAll(queryObject: any) {
    const filters = new APIFilters(this.Model.find(), queryObject)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const all: any[] = await filters.query;
    return all;
  }
  async getOne(id: string) {
    if (!id) new AppError('Please pass an  product id.', 422);

    const one = await this.Model.findById(id);
    return one;
  }
  async update() {
    //
  }

  async deleteOne(id: string) {
    const deleted = await this.Model.findByIdAndDelete(id);
    return deleted;
  }
}
export default FactoryCRUDService;
