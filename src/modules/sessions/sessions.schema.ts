import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import CtmSchema from '../../common/decorators/schema.decorator';
import { Document } from '../../common/schema/document.schema';
import { Exclude } from 'class-transformer';

export type SessionDocument = HydratedDocument<Session>;

@CtmSchema()
export class Session extends Document {
  @Prop({
    required: true,
    ref: 'User',
  })
  userId: string;

  @Prop({
    required: true,
    enum: ['access', 'reset'],
  })
  @Exclude()
  type: 'access' | 'reset';

  @Prop({
    required: true,
  })
  ip: string;

  @Prop({
    default: true,
  })
  @Exclude()
  valid: boolean;

  @Prop({
    required: true,
  })
  userAgent: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
