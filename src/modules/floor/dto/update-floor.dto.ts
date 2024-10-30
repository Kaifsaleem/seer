import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class TaskDto {
  @IsString()
  description: string;

  @IsEnum(['text', 'multipleChoice'])
  type: 'text' | 'multipleChoice';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}

export class UpdateFloorDto {
  @ApiProperty({
    type: [TaskDto],
    description: 'Array of tasks associated with the floor',
    example: [
      {
        description: 'Change bedsheet',
        type: 'text',
        options: [],
      },
      {
        description: 'Clean floor',
        type: 'multipleChoice',
        options: ['Option 1', 'Option 2'],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}
