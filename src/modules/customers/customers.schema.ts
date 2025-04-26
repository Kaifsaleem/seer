import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Document } from '../../common/schema/document.schema';
import CtmSchema from '../../common/decorators/schema.decorator';

@CtmSchema()
export class Customer extends Document {
  @Prop({
    required: true,
    minlength: 3,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  phone: string;

  @Prop({
    default: '',
  })
  address: string;

  @Prop({
    type: Object,
    default: {},
  })
  billingInfo: {
    gstin?: string;
    companyName?: string;
    billingAddress?: string;
  };

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    required: true,
    type: Number,
  })
  identityDocument: number;
  @Prop({
    default: 0,
  })
  outstandingBalance: number;
}

export type CustomerDocument = HydratedDocument<Customer>;
export const CustomerSchema = SchemaFactory.createForClass(Customer);
