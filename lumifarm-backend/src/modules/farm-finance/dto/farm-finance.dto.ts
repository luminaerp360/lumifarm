import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDate, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { TransactionType, ExpenseCategory, IncomeCategory, PaymentStatus } from '../schemas/farm-finance.schema';

export class CreateFarmFinanceDto {
  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  cropCycleId?: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsString()
  @IsNotEmpty()
  category: string; // ExpenseCategory or IncomeCategory

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDate()
  @IsNotEmpty()
  transactionDate: Date;

  @IsDate()
  @IsOptional()
  paidDate?: Date;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  buyer?: string;

  @IsNumber()
  @IsOptional()
  quantitySold?: number;

  @IsNumber()
  @IsOptional()
  pricePerUnit?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  documents?: string[];
}

export class UpdateFarmFinanceDto extends PartialType(CreateFarmFinanceDto) {
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;
}
