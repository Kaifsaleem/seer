import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { ApiProperty } from '@nestjs/swagger';
// import * as mongoose from 'mongoose';

@Schema()
export class Floor extends Document {
  @Prop({ type: Number, required: true, unique: true })
  floorNumber: number;

  @Prop({ type: String, required: true, unique: true })
  qrCode: string;

  @Prop({ type: String, required: true, unique: true })
  floorKey: string;

  @Prop({
    type: [
      {
        description: { type: String, required: true },
        type: {
          type: String,
          enum: ['text', 'multipleChoice'],
          required: true,
        },
        options: { type: [String] },
      },
    ],
    required: true,
  })
  tasks: {
    description: string;
    type: 'text' | 'multipleChoice';
    options?: string[];
  }[];
}

export const FloorSchema = SchemaFactory.createForClass(Floor);
