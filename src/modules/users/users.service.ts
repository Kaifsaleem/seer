import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserType } from './users.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto, user?: Express.User) {
    console.log(user);
    if (user && user.type !== UserType.ADMIN) {
      throw new BadRequestException('Only admins can create new users');
    }
    const isEmailExist = await this.findByEmail(createUserDto.email);

    if (isEmailExist) {
      throw new ConflictException('Email already exists');
    }

    // Ensure only admin users can be created
    const newUser = new this.userModel({
      ...createUserDto,
      type: UserType.ADMIN,
    });
    await newUser.save();

    this.eventEmitter.emit('user.create.success', newUser, createUserDto);
    return newUser.toObject();
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: Express.User) {
    // console.log(user);
    if (user.type !== 'ADMIN' && user.id !== id) {
      throw new Error('You are not authorized to update this user');
    }
    const existUser = await this.findById(id);
    // console.log(existUser);
    existUser.set(updateUserDto);
    await existUser.save();
    return existUser.toObject();
  }

  async findAll(user: Express.User) {
    // check user is admin
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to view this user');
    }

    const users = await this.userModel.find();

    return users.map((user) => user.toObject());
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
      throw new BadRequestException(
        'You are not authorized to delete this user',
      );
    }
    const existUser = await this.findById(id);
    if (!existUser) {
      throw new BadRequestException('User not found');
    }
    await this.userModel.deleteOne({ _id: id });
    // return exist user deleted

    return existUser.toObject();
  }
}
