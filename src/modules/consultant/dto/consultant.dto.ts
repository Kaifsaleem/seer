import { IsNumber, IsString } from 'class-validator';

export class QueryFundDto {
  @IsNumber()
  targetReturn: number;

  @IsNumber()
  years: number;
}
