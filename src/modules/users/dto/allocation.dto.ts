import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import { IsOptional } from 'class-validator';
export class allocationDto {
  @ApiProperty({
    example: [
      {
        floor: 1,
        rooms: [101, 102],
      },
    ],
    required: true,
  })
  @IsNotEmpty()
  assignedFloorsRooms: {
    floor: number;
    rooms: number[];
  }[];
}
