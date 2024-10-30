import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';

class TaskDto {
  @ApiProperty({
    example: 'Change bedsheet',
    description: 'Description of the task',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'text',
    description: 'Type of the task',
    enum: ['text', 'multipleChoice'],
  })
  @IsEnum(['text', 'multipleChoice'])
  type: 'text' | 'multipleChoice';

  @ApiProperty({
    example: ['Option 1', 'Option 2'],
    description: 'Options for multiple-choice tasks',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}

export class CreateFloorDto {
  @ApiProperty({ example: 1, description: 'The unique floor number' })
  @IsNumber()
  floorNumber: number;

  // @ApiProperty({
  //   description: 'QR Code as base64-encoded image (generated internally)',
  //   type: String,
  //   format: 'binary',
  //   readOnly: true, // This makes it visible only in the response, not in the input
  // })
  // qrCode?: string;

  @ApiProperty({
    type: [TaskDto],
    description: 'Array of tasks associated with the floor',
  })
  @IsArray()
  tasks: TaskDto[];
}
