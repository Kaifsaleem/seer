import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailExist = await this.findByEmail(createUserDto.email);

    // TODO: Mabye we can create a custom decorator for this
    if (isEmailExist) {
      throw new ConflictException('Email already exists');
    }

    const user = new this.userModel(createUserDto);
    await user.save();

    this.eventEmitter.emit('user.create.success', user, createUserDto);
    return user.toObject();
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: Express.User) {
    if (user.type !== 'ADMIN' && user.id !== id) {
      throw new Error('You are not authorized to update this user');
    }
    const existUser = await this.findById(id);
    existUser.set(updateUserDto);
    return existUser.toObject();
  }

  async findAll(user: Express.User) {
    // check user is admin
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to view this user');
    }

    return this.userModel.find();
  }

  async findOne(id: string, user: Express.User) {
    if (user.type !== 'ADMIN' && user.id !== id) {
      throw new Error('You are not authorized to view this user');
    }
    return this.findById(id);
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async remove(id: string, user: Express.User) {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to delete this user');
    }
    const existUser = await this.findById(id);
    if (!existUser) {
      throw new Error('User not found');
    }
    await this.userModel.deleteOne({ _id: id });
  }
}
