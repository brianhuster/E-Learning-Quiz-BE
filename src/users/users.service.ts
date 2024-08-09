import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  UserDocument,
  UserEntity,
} from 'src/database/schema/users/user.schema';
import { FilterGetUserRequest } from './dto/filterGetUserRequest';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).lean();
  }

  async create(user: UserEntity): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findAll(limit = 20, page = 0, filter: FilterGetUserRequest) {
    const { term, role } = filter;
    const query = {};
    if (term) {
      Object.assign(query, {
        $text: {
          $search: term ?? '',
        },
      });
    }
    if (role) {
      Object.assign(query, {
        role,
      });
    }
    const [users, total] = await Promise.all([
      this.userModel
        .find(query, { hashedPassword: 0 })
        .limit(limit)
        .skip(limit * page)
        .sort({ _id: 1 })
        .lean(),
      this.userModel.countDocuments(query),
    ]);
    return {
      users,
      total,
    };
  }

  async editUser(id: string, payload: any) {
    console.log(id, payload);
    const { password, ...updateData } = payload;
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      Object.assign(updateData, { hashedPassword });
    }
    const { matchedCount } = await this.userModel.updateOne(
      { _id: id },
      updateData,
    );
    if (!matchedCount) {
      throw new NotFoundException('User not found');
    }
  }

  async deleteUser(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (!deletedCount) {
      throw new NotFoundException('User not found');
    }
  }
}
