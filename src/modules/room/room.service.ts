import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
// import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Floor } from '../floor/floor.schema';
import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { Room } from './room.schema';
// import { ObjectId } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Floor.name) private floorModel: Model<Floor>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}
  async create(createRoomDto: CreateRoomDto, user: Express.User) {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to create a room');
    }
    const existFloor = await this.floorModel
      .findOne({ floorNumber: createRoomDto.floorNumber })
      .exec();

    if (!existFloor) {
      throw new BadRequestException('Floor does not exist');
    }
    // console.log(createRoomDto);
    const room = new this.roomModel({
      ...createRoomDto,
      roomKey: `hotelStock_monitor_floor-${createRoomDto.floorNumber}-Room-${createRoomDto.roomNumber}`,
    });
    // console.log(room);
    //check if room is saved in collection then add room to that particular floor rooms array

    try {
      await room.save();
      // console.log(room);
    } catch (error) {
      throw new BadRequestException(error);
    }
    //get room id and add to floor rooms array
    existFloor.rooms.push(room._id);
    await existFloor.save();
    return room.toObject();
  }

  async findAll(user: Express.User) {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to view rooms');
    }
    const roomData = await this.roomModel.find();
    return roomData.map((room) => room.toObject());
  }

  async findOne(user: Express.User, id: number) {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to view rooms');
    }
    const room = await this.roomModel.findById(id);
    return room.toObject();
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {
  //   return `This action updates a #${id} room`;
  // }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
