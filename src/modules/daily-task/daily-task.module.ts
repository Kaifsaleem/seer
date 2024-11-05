import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyTaskService } from './daily-task.service';
import { DailyTaskController } from './daily-task.controller';
import { DailyTask, DailyTaskSchema } from './daily-task.schema';
import { Floor, FloorSchema } from '../floor/floor.schema'; // Import FloorSchema to access FloorModel

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyTask.name, schema: DailyTaskSchema },
      { name: Floor.name, schema: FloorSchema }, // Import FloorSchema to access FloorModel
    ]),
  ],
  controllers: [DailyTaskController],
  providers: [DailyTaskService],
})
export class DailyTaskModule {}
