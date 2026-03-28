import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDate,
  ValidateNested,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  CropCycleStatus,
  HarvestFrequency,
} from "../schemas/crop-cycle.schema";

export class CycleManagerDto {
  @IsString() @IsOptional() managerId?: string;
  @IsString() @IsOptional() managerName?: string;
  @IsString() @IsOptional() role?: string;
}

export class WeatherAtPlantingDto {
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
  soilMoisture?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

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
  farmWorkerName?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CycleManagerDto)
  @IsOptional()
  managers?: CycleManagerDto[];

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

  @IsNumber()
  @IsOptional()
  areaPlanted?: number;

  @IsNumber()
  @IsOptional()
  expectedYieldPerAcre?: number;

  @IsNumber()
  @IsOptional()
  actualYieldPerAcre?: number;

  @IsString()
  @IsOptional()
  yieldEstimationNotes?: string;

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

  // Season
  @IsString()
  @IsOptional()
  seasonName?: string;

  @IsString()
  @IsOptional()
  seasonYear?: string;

  // Weather at planting
  @ValidateNested()
  @Type(() => WeatherAtPlantingDto)
  @IsOptional()
  weatherAtPlanting?: WeatherAtPlantingDto;

  // Soil
  @IsString()
  @IsOptional()
  soilCondition?: string;

  @IsString()
  @IsOptional()
  soilPreparationMethod?: string;

  // Seed details
  @IsNumber()
  @IsOptional()
  seedQuantity?: number;

  @IsString()
  @IsOptional()
  seedUnit?: string;

  @IsNumber()
  @IsOptional()
  seedCostPerUnit?: number;

  @IsNumber()
  @IsOptional()
  totalSeedCost?: number;

  // Harvest details
  @IsString()
  @IsOptional()
  yieldUnit?: string;

  @IsNumber()
  @IsOptional()
  pricePerUnit?: number;

  @IsString()
  @IsOptional()
  harvestQuality?: string;

  @IsString()
  @IsOptional()
  storageLocation?: string;

  @IsString()
  @IsOptional()
  buyerName?: string;
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

  // Cost totals (computed from activities + finance)
  @IsNumber()
  @IsOptional()
  totalInputsCost?: number;

  @IsNumber()
  @IsOptional()
  totalLaborCost?: number;

  @IsNumber()
  @IsOptional()
  totalExpenses?: number;

  @IsNumber()
  @IsOptional()
  totalRevenue?: number;

  @IsNumber()
  @IsOptional()
  profitOrLoss?: number;
}
