import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  //  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { UserType, UserTypes } from '../../../common/types';

export class CreateUserDto {
  // The unique identifier for the user. Marked as read-only as it should not be modified directly.
  @ApiProperty({
    readOnly: true, // This property cannot be altered by the client
  })
  readonly _id: string;

  // The first name of the user, which is required and must be at least 3 characters long.
  @ApiProperty({
    minLength: 3, // API documentation: min length for first name is 3 characters
  })
  @MinLength(3, {
    message: 'Name must be at least 3 characters long', // Validation error message
  })
  readonly firstName: string;

  // The last name of the user, which is optional and doesn't have validation rules.
  @ApiProperty({
    required: false, // API documentation: this field is optional
  })
  @IsOptional() // Validation decorator: this field can be omitted
  lastName: string;

  // The user's email address, which must be valid and follow a proper email format.
  @ApiProperty({
    format: 'email', // API documentation: specifies that the format should be an email
  })
  @IsEmail(
    {},
    {
      message: 'Please provide a valid email address', // Validation error message
    },
  )
  readonly email: string;

  // Uncomment the following lines if phone number validation is required.
  // The phone number must follow a specific pattern for Indian numbers (starting with +91).
  // @ApiProperty({
  //   pattern: `^\\+91[1-9]{1}[0-9]{9}$`,  // API documentation: Indian phone number format
  // })
  // @IsPhoneNumber(null, {
  //   message: 'Please provide a valid Phone Number',  // Validation error message
  // })
  // readonly phone: string;

  // The user type, which can be one of the available `UserTypes` except for `SUPER_ADMIN`.
  // The default value is set to `USER`.
  @ApiProperty({
    default: UserTypes.USER, // Default value is USER
  })
  @IsEnum(UserTypes, {
    message: 'Invalid user type', // Validation error message if the type is incorrect
  })
  type: UserType;

  // The password for the user, which must be at least 6 characters long and is write-only.
  @ApiProperty({
    minLength: 6, // API documentation: password must be at least 6 characters
    writeOnly: true, // Password should not be returned in API responses
  })
  @MinLength(6, {
    message: 'Password is too short', // Validation error message
  })
  password: string;

  // The company name associated with the user, which is required and must be at least 1 character long.
  @ApiProperty({
    minLength: 1, // API documentation: min length for company name is 1 characters
    writeOnly: true, // Company name should not be returned in API responses
  })
  @MinLength(1, {
    message: 'Company name is required', // Validation error message
  })
  company: string;
}
