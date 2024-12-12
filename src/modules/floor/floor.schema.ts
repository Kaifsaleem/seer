import { Prop, SchemaFactory } from '@nestjs/mongoose';
import CtmSchema from '../../common/decorators/schema.decorator';
import { Document } from '../../common/schema/document.schema';

@CtmSchema()
export class Floor extends Document {
  @Prop({ type: Number, required: true, unique: true })
  floorNumber: number;

  // CREATE AN ARRAY OF OBJECT ID FOR ROOM

  @Prop({ type: [String] })
  rooms: string[];
}

export const FloorSchema = SchemaFactory.createForClass(Floor);
