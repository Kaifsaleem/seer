import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { DailyTaskService } from './daily-task.service';
import { UpdateTasksDto } from './dto/update-daily-task.dto';
import { DailyTask } from './daily-task.schema';

@Controller('daily-tasks')
export class DailyTaskController {
  constructor(private readonly dailyTaskService: DailyTaskService) {}

  @Get('tasks')
  @ApiCreatedResponse({
    description: 'daily task',
    type: DailyTask,
  })
  async getTasksByQRCode(@Query('floor key') floorKey: string) {
    return this.dailyTaskService.getTasksByQRCode(floorKey);
  }

  @Get('today/tasks')
  @ApiCreatedResponse({
    description: 'daily task',
    type: DailyTask,
  })
  async getTodayTasks() {
    return this.dailyTaskService.getTodayTasks();
  }

  @Patch('tasks/update')
  @ApiCreatedResponse({
    description: 'update Floor',
    type: UpdateTasksDto,
  })
  async updateTaskStatus(
    // @Query('qrCode') qrCode: string,
    @Body() updateTasksDto: UpdateTasksDto,
  ) {
    return this.dailyTaskService.updateTasksStatus(updateTasksDto);
  }
}
