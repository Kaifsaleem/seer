import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { allocationDto } from './dto/allocation.dto';
import { Room } from '../room/room.schema';
import { Floor } from '../floor/floor.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Floor.name) private floorModel: Model<Floor>,
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

  // assign floorsand rooms to user by admin
  async updateAssignedFloorsRooms(
    userId: string,
    updateDto: allocationDto,
    user: Express.User,
  ): Promise<User> {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to update this user');
    }

    const { assignedFloorsRooms } = updateDto;

    const validatedFloorsRooms = [];
    assignedFloorsRooms.forEach(async (floorRoom) => {
      // });
      // for (const floorRoom of assignedFloorsRooms) {
      const { floor, rooms } = floorRoom;

      // Check if floor exists in the Floor model
      const existingFloor = await this.floorModel
        .findOne({ floorNumber: floor })
        .exec();
      if (!existingFloor) {
        throw new NotFoundException(`Floor ${floor} does not exist.`);
      }
      // Check if all rooms exist in the Room model
      const existingRooms = await this.roomModel
        .find({ roomNumber: { $in: rooms } })
        .exec();

      if (existingRooms.length !== rooms.length) {
        console.log(existingRooms.length, rooms.length);
        throw new NotFoundException(
          `Some rooms do not exist: ${rooms.filter(
            (room) =>
              !existingRooms.some(
                (existingRoom) => existingRoom.roomNumber === room,
              ),
          )}`,
        );
      }

      // Append validated floorRoom data
      validatedFloorsRooms.push({ floor, rooms });
    });

    // Update user with validated data
    const updatedUser = await this.userModel.findById(userId).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const existdata = updatedUser.assignedFloorsRooms;
    existdata.push(...validatedFloorsRooms);
    await updatedUser.save();

    return updatedUser;
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
