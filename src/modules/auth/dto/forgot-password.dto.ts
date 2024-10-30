import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    type: 'string',
    format: 'email',
    example: 'shaikhbilal2732001@gmail.com',
  })
  @IsEmail()
  email: string;
}
