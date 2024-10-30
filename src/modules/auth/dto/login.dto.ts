import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    format: 'email',
    writeOnly: true,
  })
  @IsString()
  login: string;

  @ApiProperty({
    writeOnly: true,
  })
  @IsString()
  password: string;

  @IsIP()
  @IsOptional()
  ip: string;

  @IsString()
  @IsOptional()
  userAgent: string;

  @ApiProperty({
    readOnly: true,
    example: 'ey...',
  })
  token: string;
}
