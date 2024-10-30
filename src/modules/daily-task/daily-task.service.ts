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
  @Cron('* * * * *')
  async createDailyTasks() {
    this.logger.log('Creating daily tasks for all floors');

    const floors = await this.floorModel.find().exec();
    if (floors.length === 0) {
      this.logger.warn('No floors found. Skipping daily task creation.');
      return;
    }

    // const dailyTasks = floors.map((floor) => ({
    //   floorNumber: floor.floorNumber,
    //   tasks: [
    //     { name: 'Check lights', isCompleted: false },
    //     { name: 'Clean lobby', isCompleted: false },
    //     { name: 'Refill supplies', isCompleted: false },
    //   ],
    // }));
    for (const floor of floors) {
      const tasks = [
        { description: 'Change bedsheet', type: 'text', status: 'pending' },
        {
          description: 'Clean floor',
          type: 'multipleChoice',
          options: ['Option 1', 'Option 2'],
          status: 'pending',
        },
      ];

      const dailyTask = new this.dailyTaskModel({
        date: new Date(),
        floorTasks: tasks,
        floor: floor._id,
      });

      await dailyTask.save();
      this.logger.log('Daily tasks created successfully for all floors');
    }
  }
  // Method to fetch and authorize tasks by QR code
  async getTasksByQRCode(qrCode: string) {
    const floor = await this.floorModel.findOne({ qrCode }).exec();
    console.log(floor);

    if (!floor) {
      throw new UnauthorizedException('Invalid QR code');
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
    const { qrCode, tasks } = updateTasksDto;

    // Find floor by QR code
    const floor = await this.floorModel.findOne({ qrCode }).exec();
    if (!floor) {
      throw new UnauthorizedException('Invalid QR code');
    }
    const currentDate = new Date();
    const startOfMinute = new Date(currentDate.setSeconds(0, 0));
    const endOfMinute = new Date(currentDate.setSeconds(59, 999));

    // Get today's task for the matched floor
    const dailyTask = await this.dailyTaskModel
      .findOne({
        date: { $gte: startOfMinute, $lte: endOfMinute },
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
        task.status = taskUpdate.answer;
      }
    });

    await dailyTask.save();

    // // Find the specific floor task in daily tasks
    // const floorTask = dailyTask.floorTasks.find(
    //   (ft) => ft.floorNumber === floor.floorNumber,
    // );
    // if (!floorTask) {
    //   throw new UnauthorizedException('Floor tasks not found');
    // }

    // // Update each task's answer in floorTask
    // tasks.forEach(({ taskId, answer }) => {
    //   const task = floorTask.tasks.find((t) => t._id.toString() === taskId);
    //   if (task) {
    //     task.answer = answer;
    //     task.isCompleted = true; // Mark as completed when updated
    //   }
    // });

    // await dailyTask.save();
    return dailyTask;
  }
}
