import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyTask } from './daily-task.schema';
import { Floor } from '../floor/floor.schema';
import { UpdateTasksDto } from './dto/update-daily-task.dto';

@Injectable()
export class DailyTaskService {
  private readonly logger = new Logger(DailyTaskService.name);

  constructor(
    @InjectModel(DailyTask.name) private dailyTaskModel: Model<DailyTask>,
    @InjectModel(Floor.name) private floorModel: Model<Floor>,
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
    for (const floor of floors) {
      const tasks = floor.tasks;

      const dailyTask = new this.dailyTaskModel({
        date: new Date(),
        floorTasks: tasks,
        floor: floor._id,
        floorNumber: floor.floorNumber,
      });

      await dailyTask.save();
      this.logger.log(
        'Daily tasks created successfully for floor ' + floor.floorNumber,
      );
    }
  }
  // Method to fetch and authorize tasks by foor key code
  async getTasksByQRCode(floorKey: string) {
    const floor = await this.floorModel.findOne({ floorKey }).exec();
    console.log(floor);

    if (!floor) {
      throw new UnauthorizedException('Invalid floorKey ');
    }
    const currentDate = new Date();
    const startOfMinute = new Date(currentDate.setSeconds(0, 0));
    const endOfMinute = new Date(currentDate.setSeconds(59, 999));

    const dailyTask = await this.dailyTaskModel
      .findOne({
        date: { $gte: startOfMinute, $lte: endOfMinute },
        floor: floor._id,
      })
      .exec();

    if (!dailyTask) {
      throw new UnauthorizedException('No tasks found for this floor today');
    }

    // Return only the tasks for the specific floor
    return dailyTask;
  }

  // Method to update a specific task’s status by a worke

  async updateTasksStatus(updateTasksDto: UpdateTasksDto) {
    const { floorKey, tasks } = updateTasksDto;

    // Find floor by QR code key
    const floor = await this.floorModel.findOne({ floorKey }).exec();
    if (!floor) {
      throw new UnauthorizedException('Invalid floor key ');
    }
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    // Get today's task for the matched floor
    const dailyTask = await this.dailyTaskModel
      .findOne({
        date: { $gte: startOfDay, $lte: endOfDay },
        floor: floor._id,
      })
      .exec();

    if (!dailyTask) {
      throw new UnauthorizedException('No tasks found for this floor today');
    }
    tasks.forEach((taskUpdate) => {
      const task = dailyTask.floorTasks.find(
        (t) => t._id.toString() === taskUpdate.taskId,
      );
      if (task) {
        task.status = taskUpdate.status;
      }
    });

    await dailyTask.save();

    return dailyTask;
  }

  // Method to fetch today's tasks for all floors
  async getTodayTasks() {
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
    return dailyTasks;
  }
}
