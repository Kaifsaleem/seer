import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    pattern: '^[0-9a-f]{24}$',
    readOnly: true,
  })
  readonly _id: string;

  @ApiProperty({
    pattern: '^[0-9a-f]{24}$',
  })
  userId: string;

  @ApiProperty({
    format: 'ipv4',
  })
  ip: string;

  @ApiProperty({
    example:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome',
  })
  userAgent: string;

  valid: boolean;

  type: 'access' | 'refresh' | 'reset' | 'verify';

  method: string;

  @ApiProperty({
    format: 'date-time',
    readOnly: true,
  })
  createdAt: Date;
}
