import { ITour } from '../interface/ITour';
import { Tour } from '../models/tourModel';


class TourService {

  async create(tour: ITour) {
    const newTour = await Tour.create(tour)
    return newTour
  }

  async update(tour: ITour) {
    //
  }
  async delete(id: string) {
    //
  }

  async getOne(id: string) {
    //
  }

  async getAll() {
    //
  }



}

export default new TourService();
