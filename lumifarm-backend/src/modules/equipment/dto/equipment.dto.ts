import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
} from "class-validator";
import {
  EquipmentCategory,
  EquipmentStatus,
  EquipmentCondition,
} from "../schemas/equipment.schema";

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(EquipmentCategory)
  @IsOptional()
  category?: EquipmentCategory;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  modelName?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsEnum(EquipmentStatus)
  @IsOptional()
  status?: EquipmentStatus;

  @IsEnum(EquipmentCondition)
  @IsOptional()
  condition?: EquipmentCondition;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  farmName?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  assignedToName?: string;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @IsNumber()
  @IsOptional()
  currentValue?: number;

  @IsString()
  @IsOptional()
  fuelType?: string;

  @IsString()
  @IsOptional()
  enginePower?: string;

  @IsString()
  @IsOptional()
  capacity?: string;

  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: string;

  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @IsDateString()
  @IsOptional()
  insuranceExpiry?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateEquipmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(EquipmentCategory)
  @IsOptional()
  category?: EquipmentCategory;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  modelName?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsEnum(EquipmentStatus)
  @IsOptional()
  status?: EquipmentStatus;

  @IsEnum(EquipmentCondition)
  @IsOptional()
  condition?: EquipmentCondition;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  farmName?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  assignedToName?: string;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @IsNumber()
  @IsOptional()
  currentValue?: number;

  @IsString()
  @IsOptional()
  fuelType?: string;

  @IsString()
  @IsOptional()
  enginePower?: string;

  @IsString()
  @IsOptional()
  capacity?: string;

  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: string;

  @IsNumber()
  @IsOptional()
  totalMaintenanceCost?: number;

  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @IsDateString()
  @IsOptional()
  insuranceExpiry?: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AddMaintenanceDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  performedBy?: string;

  @IsString()
  @IsOptional()
  type?: string; // routine, repair, overhaul
}
