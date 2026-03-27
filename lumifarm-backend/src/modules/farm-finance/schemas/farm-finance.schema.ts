import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export enum ExpenseCategory {
  SEED = 'seed',
  FERTILIZER = 'fertilizer',
  PESTICIDES = 'pesticides',
  LABOR = 'labor',
  WATER = 'water',
  EQUIPMENT = 'equipment',
  TRANSPORT = 'transport',
  STORAGE = 'storage',
  UTILITIES = 'utilities',
  MAINTENANCE = 'maintenance',
  OTHER = 'other',
}

export enum IncomeCategory {
  CROP_SALE = 'crop_sale',
  LIVESTOCK_SALE = 'livestock_sale',
  SUBSIDY = 'subsidy',
  GRANT = 'grant',
  OTHER = 'other',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  PARTIALLY_PAID = 'partially_paid',
}

@Schema({ timestamps: true })
export class FarmFinance extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: false, default: '' })
  farmId: string;

  @Prop({ required: false, default: '' })
  cropCycleId: string;

  @Prop({ type: String, enum: TransactionType, default: TransactionType.EXPENSE })
  transactionType: TransactionType;

  @Prop({
    type: String,
    enum: [...Object.values(ExpenseCategory), ...Object.values(IncomeCategory)],
  })
  category: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ required: true })
  transactionDate: Date;

  @Prop({ required: false })
  paidDate: Date;

  @Prop({ required: false, default: '' })
  paymentMethod: string; // e.g., "cash", "mobile_money", "bank_transfer"

  @Prop({ required: false, default: '' })
  reference: string; // Transaction reference/receipt number

  @Prop({ required: false, default: '' })
  vendor: string; // For expenses

  @Prop({ required: false, default: '' })
  buyer: string; // For income

  @Prop({ required: false, default: 0 })
  quantitySold: number; // For income transactions

  @Prop({ required: false, default: 0 })
  pricePerUnit: number; // For income transactions

  @Prop({ required: false, default: '' })
  notes: string;

  @Prop({ type: [String], default: [] })
  documents: string[]; // Receipts, invoices

  @Prop({ required: false, default: '' })
  recordedBy: string; // User ID who recorded this
}

export const FarmFinanceSchema = SchemaFactory.createForClass(FarmFinance);
FarmFinanceSchema.index({ tenantId: 1 });
FarmFinanceSchema.index({ farmId: 1 });
FarmFinanceSchema.index({ cropCycleId: 1 });
FarmFinanceSchema.index({ transactionType: 1 });
FarmFinanceSchema.index({ category: 1 });
FarmFinanceSchema.index({ paymentStatus: 1 });
FarmFinanceSchema.index({ transactionDate: -1 });
