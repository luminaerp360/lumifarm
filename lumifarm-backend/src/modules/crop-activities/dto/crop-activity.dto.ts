import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ActivityType, ActivityStatus } from '../schemas/crop-activity.schema';

export class ActivityInputDto {
  @IsString()
  @IsOptional()
  inputName?: string;

  @IsString()
  @IsOptional()
  inputType?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  costPerUnit?: number;

  @IsNumber()
  @IsOptional()
  totalCost?: number;
}

export class WeatherDto {
  @IsString()
  @IsOptional()
  condition?: string;

  @IsString()
  @IsOptional()
  temperature?: string;

  @IsString()
  @IsOptional()
  rainfall?: string;

  @IsString()
  @IsOptional()
  humidity?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateCropActivityDto {
  @IsString()
  @IsNotEmpty()
  cropCycleId: string;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  plotId?: string;

  @IsEnum(ActivityType)
  @IsNotEmpty()
  activityType: ActivityType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsNotEmpty()
  scheduledDate: Date;

  @IsNumber()
  @IsOptional()
  daysAfterPlanting?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActivityInputDto)
  @IsOptional()
  inputs?: ActivityInputDto[];

  @IsNumber()
  @IsOptional()
  workersCount?: number;

  @IsNumber()
  @IsOptional()
  laborHours?: number;

  @IsNumber()
  @IsOptional()
  laborCost?: number;

  @IsString()
  @IsOptional()
  assignedWorkerId?: string;

  @IsString()
  @IsOptional()
  assignedWorkerName?: string;

  @ValidateNested()
  @Type(() => WeatherDto)
  @IsOptional()
  weather?: WeatherDto;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  images?: string[];
}

export class UpdateCropActivityDto extends PartialType(CreateCropActivityDto) {
  @IsEnum(ActivityStatus)
  @IsOptional()
  status?: ActivityStatus;

  @IsDate()
  @IsOptional()
  completedDate?: Date;

  @IsNumber()
  @IsOptional()
  totalInputCost?: number;

  @IsNumber()
  @IsOptional()
  totalActivityCost?: number;
}
