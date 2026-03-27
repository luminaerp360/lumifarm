import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDate, IsArray, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { WorkerRole, WorkerSpecialization } from '../schemas/farm-worker.schema';

export class CreateFarmWorkerDto {
  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(WorkerRole)
  @IsOptional()
  role?: WorkerRole;

  @IsEnum(WorkerSpecialization)
  @IsOptional()
  specialization?: WorkerSpecialization;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nationalId?: string;

  @IsDate()
  @IsOptional()
  joinDate?: Date;

  @IsString()
  @IsOptional()
  availability?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  monthlyWage?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  skills?: string;

  @IsArray()
  @IsOptional()
  documents?: string[];

  @IsString()
  @IsOptional()
  healthInsuranceNumber?: string;
}

export class UpdateFarmWorkerDto extends PartialType(CreateFarmWorkerDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsDate()
  @IsOptional()
  leaveDate?: Date;
}
