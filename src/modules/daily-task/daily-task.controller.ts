import { Controller, Get, Patch, Body, Query } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { DailyTaskService } from './daily-task.service';
import { UpdateTasksDto } from './dto/update-daily-task.dto';

@Controller('daily-tasks')
export class DailyTaskController {
  constructor(private readonly dailyTaskService: DailyTaskService) {}

  @Get('tasks')
  async getTasksByQRCode(@Query('qrCode') qrCode: string) {
    return this.dailyTaskService.getTasksByQRCode(qrCode);
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
