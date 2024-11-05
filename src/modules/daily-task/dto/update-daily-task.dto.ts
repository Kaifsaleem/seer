import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({
    example: '60d0fe4f5311236168a109ca',
    description: 'The unique identifier of the task',
  })
  @IsString()
  taskId: string;

  @ApiProperty({
    example: 'Completed',
    description: 'Worker-provided answer for the task',
  })
  @IsString()
  status: string; // Worker-provided answer for the task
}

export class UpdateTasksDto {
  @ApiProperty({
    example: 'secret-key',
    description: 'key of the floor',
  })
  @IsString()
  floorKey: string;

  @ApiProperty({
    type: [UpdateTaskDto],
    description: 'Array of tasks to be updated',
    example: [
      {
        taskId: '60d0fe4f5311236168a109ca',
        status: 'Completed',
      },
      {
        taskId: '60d0fe4f5311236168a109cb',
        status: 'Pending',
      },
    ],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  tasks: UpdateTaskDto[];
}
