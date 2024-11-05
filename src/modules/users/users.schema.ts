import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { UserType, UserTypes } from '../../common/types';
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

  // @Prop({})
  // phone: string;

  @Prop({
    required: true,
  })
  @Exclude()
  password: string;

  // @Prop({
  //   default: '',
  // })
  // passwordResetToken: string;

  // @Prop({
  //   default: '',
  // })
  // passwordResetExpires: Date;

  @Prop({
    default: 'User',
    enum: Object.values(UserTypes),
  })
  type: UserType;

  @Prop({
    required: false,
  })
  assignFloors: number[];

  // @Prop({
  //   default: '',
  // })
  // verificationToken: string;

  // @Prop({
  //   default: '',
  // })
  // mailVerificationExpires: Date;

  // @Prop({
  //   default: false,
  // })
  // isEmailVerified: boolean;

  async comparePassword(candidatePassword: string) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      Logger.error(error.message, 'comparePassword');
    }
    return false;
  }

  // async generateResetPasswordToken() {
  //   try {
  //     const buffer = randomBytes(32);
  //     const resetToken = buffer.toString('hex');
  //     return resetToken;
  //   } catch (error) {
  //     Logger.error(error.message, 'generateResetPasswordToken');
  //   }
  //   return '';
  // }

  // async generateEmailVerificationToken() {
  //   try {
  //     const buffer = randomBytes(32);
  //     const verificationToken = buffer.toString('hex');
  //     return verificationToken;
  //   } catch (error) {
  //     Logger.error(error.message, 'generateVerificationToken');
  //   }
  //   return '';
  // }
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
