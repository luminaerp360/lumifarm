import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { PlotStatus } from '../schemas/plot.schema';

export class CreatePlotDto {
  @IsString()
  @IsNotEmpty()
  farmId: string;

  @IsString()
  @IsNotEmpty()
  plotNumber: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  areaInAcres: number;

  @IsString()
  @IsOptional()
  cropType?: string;

  @IsString()
  @IsOptional()
  soilQuality?: string;

  @IsNumber()
  @IsOptional()
  costToOperatePerCycle?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdatePlotDto extends PartialType(CreatePlotDto) {
  @IsEnum(PlotStatus)
  @IsOptional()
  status?: PlotStatus;

  @IsString()
  @IsOptional()
  currentCropCycleId?: string;

  @IsOptional()
  lastPlantedDate?: Date;

  @IsOptional()
  lastHarvestedDate?: Date;
}
