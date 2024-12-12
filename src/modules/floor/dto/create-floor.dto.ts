import { ApiProperty } from '@nestjs/swagger';
import {
  // IsString,
  IsNumber,
  IsArray,
  // IsEnum,
  // IsOptional,
} from 'class-validator';
export class CreateFloorDto {
  @ApiProperty({ example: 1, description: 'The unique floor number' })
  @IsNumber()
  floorNumber: number;

  // room is required
  @ApiProperty({
    type: [String],
    description: 'Array of rooms on the floor',
  })
  @IsArray()
  rooms: string[];
}
