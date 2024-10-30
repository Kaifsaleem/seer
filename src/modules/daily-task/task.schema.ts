import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ required: false }) // Store worker-provided answer
  answer: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
