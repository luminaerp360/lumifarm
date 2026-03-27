import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CropCycleStatus, HarvestFrequency } from '../schemas/crop-cycle.schema';

export class CreateCropCycleDto {
  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  plotId?: string;

  @IsString()
  @IsNotEmpty()
  farmWorkerId: string;

  @IsString()
  @IsOptional()
  cycleNumber?: string;

  @IsDate()
  @IsNotEmpty()
  plantingDate: Date;

  @IsDate()
  @IsNotEmpty()
  expectedHarvestDate: Date;

  @IsString()
  @IsNotEmpty()
  cropType: string;

  @IsString()
  @IsOptional()
  seedSupplier?: string;

  @IsString()
  @IsOptional()
  seedVariety?: string;

  @IsNumber()
  @IsOptional()
  projectedYield?: number;

  @IsNumber()
  @IsOptional()
  expectedCropValue?: number;

  @IsString()
  @IsOptional()
  fertilizer?: string;

  @IsString()
  @IsOptional()
  pesticides?: string;

  @IsNumber()
  @IsOptional()
  waterConsumption?: number;

  @IsNumber()
  @IsOptional()
  laborCost?: number;

  @IsEnum(HarvestFrequency)
  @IsOptional()
  harvestFrequency?: HarvestFrequency;

  @IsString()
  @IsOptional()
  terms?: string;

  @IsArray()
  @IsOptional()
  documents?: string[];

  @IsString()
  @IsOptional()
  farmingPractices?: string;

  @IsString()
  @IsOptional()
  pestManagementMethod?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCropCycleDto extends PartialType(CreateCropCycleDto) {
  @IsEnum(CropCycleStatus)
  @IsOptional()
  status?: CropCycleStatus;

  @IsDate()
  @IsOptional()
  actualHarvestDate?: Date;

  @IsNumber()
  @IsOptional()
  actualYield?: number;

  @IsNumber()
  @IsOptional()
  actualCropValue?: number;

  @IsDate()
  @IsOptional()
  completedAt?: Date;

  @IsString()
  @IsOptional()
  abandonmentReason?: string;
}
