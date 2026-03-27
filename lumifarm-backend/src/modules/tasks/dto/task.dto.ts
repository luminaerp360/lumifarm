import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsArray,
  IsNotEmpty,
} from 'class-validator';
import { TaskPriority, TaskStatus, TaskCategory } from '../schemas/task.schema';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  assignedToName?: string;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  farmName?: string;

  @IsString()
  @IsOptional()
  plotId?: string;

  @IsString()
  @IsOptional()
  plotName?: string;

  @IsString()
  @IsOptional()
  cropCycleId?: string;

  @IsString()
  @IsOptional()
  cropCycleName?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsNumber()
  @IsOptional()
  actualCost?: number;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @IsOptional()
  actualHours?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  assignedToName?: string;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  farmName?: string;

  @IsString()
  @IsOptional()
  plotId?: string;

  @IsString()
  @IsOptional()
  plotName?: string;

  @IsString()
  @IsOptional()
  cropCycleId?: string;

  @IsString()
  @IsOptional()
  cropCycleName?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsNumber()
  @IsOptional()
  actualCost?: number;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @IsOptional()
  actualHours?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
