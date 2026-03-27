import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { PropertyType, PropertyStatus } from '../schemas/property.schema';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  county?: string;

  @IsNumber()
  @IsOptional()
  rentAmount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  depositAmount?: number;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  squareFootage?: number;

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  unitNumber?: string;

  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null || value === '' ? '' : String(value)))
  floor?: string;

  @IsString()
  @IsOptional()
  buildingName?: string;

  @IsString()
  @IsOptional()
  managerId?: string;
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @IsString()
  @IsOptional()
  currentTenantId?: string;

  @IsString()
  @IsOptional()
  currentLeaseId?: string;
}
