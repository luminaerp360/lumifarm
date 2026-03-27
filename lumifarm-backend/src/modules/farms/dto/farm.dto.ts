import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { FarmType, FarmStatus, SoilType, IrrigationType } from '../schemas/farm.schema';

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(FarmType)
  @IsOptional()
  type?: FarmType;

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
  @IsNotEmpty()
  totalAcreage: number;

  @IsEnum(SoilType)
  @IsOptional()
  soilType?: SoilType;

  @IsEnum(IrrigationType)
  @IsOptional()
  irrationType?: IrrigationType;

  @IsArray()
  @IsOptional()
  dominantCrops?: string[];

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  ownerName?: string;

  @IsString()
  @IsOptional()
  ownerPhone?: string;

  @IsString()
  @IsOptional()
  ownerEmail?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class UpdateFarmDto extends PartialType(CreateFarmDto) {
  @IsEnum(FarmStatus)
  @IsOptional()
  status?: FarmStatus;
}
