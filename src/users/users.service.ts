// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(name: string, email: string, password: string): Promise<User> {
    const user = new this.userModel({ name, email, password });
    return user.save();
  }

  async activate(email: string): Promise<User | null> {

    const user = await this.userModel.findOne({email}).exec();
    if(user) {
      user.status = 'active';
      return await user.save();
    }
    return user;
  }

  async resetPassword(email: string, old_password: string, new_password: string, password_confirmation: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if(user) {
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) {
        return { message: 'Invalid old password', user: user, status_code: 500 };
      } else {
        if(new_password === password_confirmation) {
            const hash = await bcrypt.hash(new_password, 10);
            user.password = hash;
            user.save();
            return { message: 'Password successfully reset', user: user, status_code: 200 };
        } else {
            return { message: 'Password confirmation missmatched', user: user, status_code: 500 };
        }
      }
    }
    return { message: 'User not found', user: user, status_code: 500 };
  }
}
