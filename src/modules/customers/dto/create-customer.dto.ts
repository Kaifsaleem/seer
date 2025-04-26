import {
  IsString,
  IsEmail,
  IsObject,
  IsOptional,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class BillingInfoDto {
  @ApiPropertyOptional({ description: 'GST Identification Number' })
  gstin?: string;

  @ApiPropertyOptional({ description: 'Company name for billing' })
  companyName?: string;

  @ApiPropertyOptional({ description: 'Billing address' })
  billingAddress?: string;
}

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    minLength: 3,
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'jhon@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+1234567890',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main St, Springfield, USA',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'identity document ',
    example: 1234567890123456,
  })
  @IsNotEmpty()
  identityDocument: number;
  @ApiPropertyOptional({
    description: 'Billing information',
    example: {
      gstin: '1234567890',
      companyName: 'ABC Corp',
      billingAddress: '456 Elm St, Springfield, USA',
    },
    type: BillingInfoDto,
  })
  @IsObject()
  @IsOptional()
  billingInfo?: BillingInfoDto;
}
