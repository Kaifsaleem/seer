import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto {
  @ApiProperty()
  count: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;
  // results: TData[];
}
