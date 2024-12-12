import { Prop, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import CtmSchema from '../../common/decorators/schema.decorator';
import { Document } from '../../common/schema/document.schema';
// import { Transform } from 'class-transformer';
// import { Task, TaskSchema } from './task.schema';

@CtmSchema()
export class Task extends Document {
  @ApiProperty({
    example: 'Change bedsheet',
    description: 'Description of the task',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: 'text',
    description: 'Type of the task',
    enum: ['text', 'multipleChoice'],
  })
  @Prop({ required: true, enum: ['text', 'multipleChoice'] })
  type: string;

  @ApiProperty({
    example: ['Option 1', 'Option 2'],
    description: 'Options for multiple-choice tasks',
    required: false,
  })
  @Prop({ type: [String], required: false })
  options?: string[];

  @ApiProperty({
    example: 'pending',
    description: 'Status of the task',
    enum: ['pending', 'completed'],
  })
  @Prop({ required: true, default: 'pending' })
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

@CtmSchema()
export class DailyTask extends Document {
  @Prop({ required: true })
  date: Date;

  @ApiProperty({ type: [Task], description: 'Array of tasks for the floor' })
  @Prop({ type: [TaskSchema], required: true })
  roomTasks: Task[];

  // @ApiProperty({
  //   example: '60d0fe4f5311236168a109ca',
  //   description: 'The unique identifier of the floor',
  // })
  // @Prop({ required: true, type: Types.ObjectId, ref: 'Floor' })
  // @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  // floor: Types.ObjectId;

  @ApiProperty({
    example: 1,
    description: 'The floor number',
  })
  @Prop({ required: true })
  floorNumber: number;

  @ApiProperty({
    example: 1,
    description: 'The room number',
  })
  @Prop({ required: true })
  roomNumber: number;
}

export const DailyTaskSchema = SchemaFactory.createForClass(DailyTask);
