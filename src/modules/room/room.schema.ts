import CtmSchema from '../../common/decorators/schema.decorator';
import { Document } from '../../common/schema/document.schema';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@CtmSchema()
export class Room extends Document {
  @Prop({ type: Number, required: true })
  roomNumber: number;
  //floor no. of room
  @Prop({ type: Number, required: true })
  floorNumber: number;
  @Prop({ type: String, required: true })
  roomKey: string;
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

export const RoomSchema = SchemaFactory.createForClass(Room);
