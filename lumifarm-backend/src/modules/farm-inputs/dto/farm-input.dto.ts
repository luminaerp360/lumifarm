import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from "class-validator";
import {
  InputCategory,
  PaymentMethod,
  PaymentStatus,
} from "../schemas/farm-input.schema";

export class CreateFarmInputDto {
  @IsString()
  @IsNotEmpty()
  cropCycleId: string;

  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  plotId?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(InputCategory)
  @IsOptional()
  category?: InputCategory;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsNumber()
  @IsOptional()
  amountPaid?: number;

  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsDateString()
  @IsOptional()
  applicationDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateFarmInputDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(InputCategory)
  @IsOptional()
  category?: InputCategory;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  unitPrice?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsNumber()
  @IsOptional()
  amountPaid?: number;

  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @IsDateString()
  @IsOptional()
  applicationDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
