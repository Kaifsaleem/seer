import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as geolib from 'geolib';

import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyTask } from './daily-task.schema';
import { Floor } from '../floor/floor.schema';
import { UpdateTasksDto, userLocation } from './dto/update-daily-task.dto';
import { Room } from '../room/room.schema';

@Injectable()
export class DailyTaskService {
  private readonly logger = new Logger(DailyTaskService.name);

  constructor(
    @InjectModel(DailyTask.name) private dailyTaskModel: Model<DailyTask>,
    @InjectModel(Floor.name) private floorModel: Model<Floor>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
  ) {}

  // Schedule the job to create daily tasks for all floors every day at midnight
  @Cron('0 0 * * *')
  async createDailyTasks() {
    this.logger.log('Creating daily tasks for all floors');

    const floors = await this.floorModel.find().exec();
    if (floors.length === 0) {
      this.logger.warn('No floors found. Skipping daily task creation.');
      return;
    }
    console.log(floors);
    const data: DailyTask[] = [];

    for (const floor of floors) {
      for (const room of floor.rooms) {
        const roomData = await this.roomModel
          .findOne({
            _id: room,
          })
          .exec();
        const tasks = roomData.tasks;

        const dailyTask = new this.dailyTaskModel({
          date: new Date(),
          roomTasks: tasks,
          floorNumber: floor.floorNumber,
          roomNumber: roomData.roomNumber,
        });

        console.log(dailyTask);
        data.push(dailyTask);
        Logger.log(
          'Daily tasks created successfully for floor ' +
            floor.floorNumber +
            ' room ' +
            roomData.roomNumber,
        );
      }
      console.log('hello');
    }

    await this.dailyTaskModel.create(data);
    return;
  }
  // Method to fetch and authorize tasks by foor key code
  async getTasksByQRCode(roomKey: string) {
    const room = await this.roomModel.findOne({ roomKey }).exec();
    console.log(room);

    if (!room) {
      throw new UnauthorizedException('Invalid floorKey ');
    }
    const isempty = await this.dailyTaskModel.find().exec();
    if (isempty.length === 0) {
      // create today daily task
      this.createDailyTasks();
      throw new UnauthorizedException('No tasks found for this floor today');
    }

    // const currentDate = new Date();
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

    const dailyTaskForRoom = await this.dailyTaskModel
      .findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        roomNumber: room.roomNumber,
      })
      .exec();

    if (!dailyTaskForRoom) {
      throw new UnauthorizedException('No tasks found for this floor today');
    }

    console.log(dailyTaskForRoom);
    // Return only the tasks for the specific floor
    return dailyTaskForRoom.toObject();
  }

  async isWithinGeofence(userLocation: userLocation): Promise<boolean> {
    //take latitude and longitude from env
    const flatitude = process.env.LATITUDE;
    const flongitude = process.env.LONGITUDE;
    const radius = parseFloat(process.env.RADIUS); // default radius is 0.01 degrees
    const centerLocation = {
      latitude: flatitude,
      longitude: flongitude,
    };
    const distance = geolib.getDistance(userLocation, centerLocation); // Calculate distance in meters
    return distance <= radius;
    //   const hotelBounds = {
    //     topLeft: { lat: 26.470041, lng: 80.331114 },
    //     topRight: { lat: 26.470093, lng:  80.331153 },
    //     bottomLeft: { lat: 26.469988, lng: 80.331196 },
    //     bottomRight: { lat: 12.34, lng: 67.895 },
    //   };

    //   const isInside =
    //     userLocation.latitude <= hotelBounds.topLeft.lat && // Below the top edge
    //     userLocation.latitude >= hotelBounds.bottomLeft.lat && // Above the bottom edge
    //     userLocation.longitude >= hotelBounds.topLeft.lng && // Right of the left edge
    //     userLocation.longitude <= hotelBounds.topRight.lng; // Left of the right edge

    //   return isInside;
  }
  // Method to update a specific task’s status by a worke

  async updateTasksStatus(updateTasksDto: UpdateTasksDto): Promise<DailyTask> {
    const { roomKey, tasks } = updateTasksDto;

    // Validate geofence
    const isInsideGeofence = await this.isWithinGeofence(
      updateTasksDto.userLocation,
    );
    // if (!isInsideGeofence) {
    //   throw new UnauthorizedException('You are outside the geofenced area');
    // }
    // Find floor by QR code key
    const room = await this.roomModel.findOne({ roomKey }).exec();
    if (!room) {
      throw new UnauthorizedException('Invalid room key ');
    }
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    // Get today's task for the matched floor
    const dailyTask = await this.dailyTaskModel
      .findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        roomNumber: room.roomNumber,
      })
      .exec();

    if (!dailyTask) {
      throw new UnauthorizedException('No tasks found for this room today');
    }
    tasks.forEach((taskUpdate) => {
      const task = dailyTask.roomTasks.find(
        (t) => t._id.toString() === taskUpdate.taskId,
      );
      if (task) {
        task.status = taskUpdate.status;
      }
    });

    await dailyTask.save();

    return dailyTask.toObject();
  }

  // Method to fetch today's tasks for all floors
  // user: Express.User
  async getTodayTasks(): Promise<DailyTask[]> {
    // console.log(user);
    // if (user.type !== 'ADMIN') {
    //   throw new UnauthorizedException('You are not authorized to view tasks');
    // }
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    const dailyTasks = await this.dailyTaskModel
      .find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();

    return dailyTasks.map((task) => task.toObject());
  }
  async getAllTasks(user: Express.User, filters: any): Promise<DailyTask[]> {
    if (user.type !== 'ADMIN') {
      throw new UnauthorizedException('You are not authorized to view tasks');
    }
    let filter = {};

    if (filters) {
      try {
        console.log(filters);
        // const inputDate = new Date(date);
        // const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
        // const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

        filter = {
          date: {
            $gte: filters.fromdate,
            $lte: filters.todate,
          },
        };
      } catch (error) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
      }
    }
    const dailyTasks = await this.dailyTaskModel.find(filter).exec();
    return dailyTasks.map((task) => task.toObject());
  }
}
