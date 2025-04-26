import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
export enum UserType {
  ADMIN = 'ADMIN',
}
import { Exclude } from 'class-transformer';
import { Document } from '../../common/schema/document.schema';
import CtmSchema from '../../common/decorators/schema.decorator';
// import { randomBytes } from 'crypto';

@CtmSchema()
export class User extends Document {
  @Prop({
    required: true,
    minlength: 3,
  })
  firstName: string;

  @Prop({
    required: false,
    default: '',
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  @Exclude()
  password: string;

  @Prop({
    default: UserType.ADMIN,
    enum: Object.values(UserType),
  })
  type: UserType;

  async comparePassword(candidatePassword: string) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      Logger.error(error.message, 'comparePassword');
    }
    return false;
  }
}

export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  // if (this.isModified('passwordResetToken')) {
  //   this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  // }

  if (!this.isModified('password')) {
    return next();
  }
  try {
    const saltRound = process.env.SALT_ROUND || 10;
    const salt = await bcrypt.genSalt(Number(saltRound));
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed');
    return next();
  } catch (error) {
    console.error(error);
    return next();
  }
});

UserSchema.loadClass(User);
