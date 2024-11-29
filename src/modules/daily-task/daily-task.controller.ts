import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { DailyTaskService } from './daily-task.service';
import { UpdateTasksDto } from './dto/update-daily-task.dto';
import { DailyTask } from './daily-task.schema';

// import { Request as ExRequest } from 'express';
// import CtmAuth from '../../common/decorators/auth.decorator';

@Controller('daily-tasks')
@ApiTags('daily-tasks')
// @CtmAuth()
export class DailyTaskController {
  constructor(private readonly dailyTaskService: DailyTaskService) {}

  @Get('floor-tasks')
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
    // @Request() req: ExRequest
    // const user = req.auth?.user;
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

  // @Get('all')
  // @ApiCreatedResponse({
  //   description: 'daily task',
  //   type: DailyTask,
  // })
  // @ApiQuery({ name: 'fromDate', required: false, type: String })
  // @ApiQuery({ name: 'toDate', required: false, type: String })
  // async getAllTasks(
  //   @Request() req: ExRequest,
  //   @Query('fromDate') fromDate?: string,
  //   @Query('toDate') toDate?: string,
  // ) {
  //   const user = req.auth?.user;
  //   const filters = {};
  //   if (fromDate) {
  //     filters['fromDate'] = fromDate;
  //   }
  //   if (toDate) {
  //     filters['toDate'] = toDate;
  //   }
  //   return this.dailyTaskService.getAllTasks(user, filters);
  // }
}
