import { BadRequestException, Injectable } from '@nestjs/common';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { Floor } from './floor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';

// import { User } from '../users/users.schema';

@Injectable()
export class FloorService {
  constructor(@InjectModel(Floor.name) private floorModel: Model<Floor>) {}
  async create(createFloorDto: CreateFloorDto, user: Express.User) {
    if (user.type !== 'ADMIN') {
      throw new Error('You are not authorized to create a floor');
    }
    const existFloor = await this.floorModel
      .findOne({ floorNumber: createFloorDto.floorNumber })
      .exec();

    if (existFloor) {
      throw new BadRequestException(
        'Floor already exist you can only update it',
      );
    }
    createFloorDto.tasks.forEach((task) => {
      if (task.type === 'text' && task.options.length > 0) {
        throw new BadRequestException(
          'no options are allowed for text type tasks',
        );
      }
    });
    // console.log('this.floorModel(createFloorDto)');
    const qrCodeData = await QRCode.toDataURL(
      `hotelStock_monitor_Floor-${createFloorDto.floorNumber}`,
    );
    // Create a new floor with QR code data
    const floor = new this.floorModel({
      qrCode: qrCodeData,
      floorKey: `hotelStock_monitor_Floor-${createFloorDto.floorNumber}`, // Include QR code in floor data
      ...createFloorDto,
    });
    // const floor = new this.floorModel(createFloorDto);
    // console.log(floor);
    try {
      await floor.save();
    } catch (error) {
      // Handle Mongoose validation errors
      if (error.name === 'ValidationError') {
        throw new BadRequestException(
          Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', '),
        );
      }
      // Handle duplicate key error
      if (error.code === 11000) {
        throw new ConflictException(
          'Duplicate key error: a record with this value already exists',
        );
      }
      // Re-throw if it's an unexpected error
      throw error;
    }
    return floor;
  }

  async findOneByFloorNumber(floorNumber: number) {
    const floor = await this.floorModel.findOne({ floorNumber }).exec();
    if (!floor) {
      throw new NotFoundException(
        `Floor with floor number ${floorNumber} not found`,
      );
    }
    return floor;
  }

  async findAll() {
    const floorsData = await this.floorModel.find();
    console.log(floorsData);
    return floorsData;
  }

  async update(id: string, updateFloorDto: UpdateFloorDto) {
    const floor = await this.floorModel.findById(id);
    if (!floor) {
      throw new BadRequestException('Floor does not exist');
    }
    updateFloorDto.tasks.forEach((task) => {
      if (task.type === 'text' && task.options.length > 0) {
        throw new BadRequestException(
          'no options are allowed for text type tasks',
        );
      }
    });
    floor.tasks = [...floor.tasks, ...updateFloorDto.tasks];
    return floor.save();
    // return this.floorModel.findByIdAndUpdate(id, updateFloorDto, { new: true });
  }

  async remove(id: string) {
    const deletedFloor = await this.floorModel.findByIdAndDelete(id).exec();
    if (!deletedFloor) {
      throw new NotFoundException(`Floor with ID ${id} not found`);
    }
    return deletedFloor;
  }
}
