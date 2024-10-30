import { ApiProperty } from '@nestjs/swagger';

export class UnauthDto {
  @ApiProperty({
    example: 'Unauthorized',
    readOnly: true,
  })
  message: string;
  @ApiProperty({
    example: 401,
    readOnly: true,
  })
  statusCode: number;
}

export class ErrorDto {
  @ApiProperty({
    example: 'Internal Server Error',
    readOnly: true,
  })
  message: string;
  @ApiProperty({
    example: 500,
    readOnly: true,
  })
  statusCode: number;
}

export class NotFoundDto {
  @ApiProperty({
    example: 'Not Found',
    readOnly: true,
  })
  message: string;
  @ApiProperty({
    example: 404,
    readOnly: true,
  })
  statusCode: number;
}

export class ForbiddenExceptionDto {
  @ApiProperty({
    readOnly: true,
  })
  message: string;
  @ApiProperty({
    example: 'Forbidden',
    readOnly: true,
  })
  error: string;
  @ApiProperty({
    example: 403,
    readOnly: true,
  })
  statusCode: number;
}
