import { IUser } from './../interface/IUser';
import { User } from '../models/UsersModel';
import APIFilters from '../utilities/APIFilters';

class UserService {
  async getAll(queryObject: any) {
    // TODO: need to dow a DTO to users
    const filters = new APIFilters(User.find(), queryObject)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users: IUser[] = await filters.query;
    return users;
  }

  async getOne(id: string) {
    const user = await User.findById(id);
    return user;
  }

  async deleteOne(id: string) {
    const deleted = await User.findByIdAndDelete(id);
    return deleted;
  }
}

export default new UserService();
