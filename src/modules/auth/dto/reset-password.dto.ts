import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  password: string;

  @Matches(/^[0-9a-f]{64}$/, {
    message: 'Invalid token',
  })
  @ApiProperty({
    pattern: '^[0-9a-f]{64}$',
  })
  token: string;
}
