import { IUser } from './../interface/IUser';
import { User } from '../models/UsersModel';
import APIFilters from '../utilities/APIFilters';
import { hashSync } from 'bcryptjs';

class UserService {
  async update(id: string, user: any) {
    console.log(
      'USER UPDATE',
      user.password,
      user.passwordConfirm,
      !!user.password || !!user.passwordConfirm,
    );

    if (!!user.password || !!user.passwordConfirm) {
      const { password, passwordConfirm } = user;
      if (password !== passwordConfirm) throw new Error('Password not coiso');
      user.password = user.passwordConfirm = hashSync(user.password, 7);
    }

    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw new Error('User not found.');
    }
    return updatedUser;
  }

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
