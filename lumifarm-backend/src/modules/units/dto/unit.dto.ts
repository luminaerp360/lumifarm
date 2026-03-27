import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { UnitStatus } from '../schemas/unit.schema';

export class CreateUnitDto {
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsString()
  @IsNotEmpty()
  unitNumber: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  rentAmount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  securityDeposit?: number;

  @IsEnum(UnitStatus)
  @IsOptional()
  status?: UnitStatus;
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
