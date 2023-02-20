import APIFilters from '../utilities/APIFilters';
import AppError from '../exceptions/AppError';

class FactoryCRUDService {
  Model: any;
  popOptions: any;
  constructor(Model: any, popOptions = null) {
    this.Model = Model;
    if (popOptions) this.popOptions;
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

    let query = this.Model.findById(id);
    if (this.popOptions) query = query.populate(this.popOptions);

    const response = await query;
    return response;
  }
  async update() {
    //
  }

  updateOne() {
    //
  }

  async deleteOne(id: string) {
    const deleted = await this.Model.findByIdAndDelete(id);
    return deleted;
  }
}
export default FactoryCRUDService;
