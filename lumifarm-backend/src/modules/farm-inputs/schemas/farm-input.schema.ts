import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseDocument } from "../../database/schemas/base.schema";

export enum InputCategory {
  SEED = "seed",
  FERTILIZER = "fertilizer",
  PESTICIDE = "pesticide",
  HERBICIDE = "herbicide",
  FUNGICIDE = "fungicide",
  INSECTICIDE = "insecticide",
  MANURE = "manure",
  FUEL = "fuel",
  EQUIPMENT_HIRE = "equipment_hire",
  LABOR = "labor",
  TRANSPORT = "transport",
  PACKAGING = "packaging",
  IRRIGATION = "irrigation",
  LAND_PREPARATION = "land_preparation",
  OTHER = "other",
}

export enum PaymentMethod {
  CASH = "cash",
  MPESA = "mpesa",
  BANK_TRANSFER = "bank_transfer",
  CHEQUE = "cheque",
  CREDIT = "credit",
  ON_ACCOUNT = "on_account",
  OTHER = "other",
}

export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  PARTIAL = "partial",
}

@Schema({ timestamps: true })
export class FarmInput extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  cropCycleId: string;

  @Prop({ required: false, default: "" })
  farmId: string;

  @Prop({ required: false, default: "" })
  plotId: string;

  // What was purchased
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: InputCategory, default: InputCategory.OTHER })
  category: InputCategory;

  @Prop({ required: false, default: "" })
  brand: string;

  @Prop({ required: false, default: "" })
  supplier: string;

  // Quantity & Pricing
  @Prop({ required: false, default: 0 })
  quantity: number;

  @Prop({ required: false, default: "" })
  unit: string; // kg, litres, bags, pieces, tonnes

  @Prop({ required: false, default: 0 })
  unitPrice: number;

  @Prop({ required: false, default: 0 })
  totalAmount: number;

  @Prop({ required: false, default: "KES" })
  currency: string;

  // Payment
  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PAID })
  paymentStatus: PaymentStatus;

  @Prop({ required: false, default: 0 })
  amountPaid: number;

  @Prop({ required: false, default: "" })
  receiptNumber: string;

  // When
  @Prop({ required: false })
  purchaseDate: Date;

  @Prop({ required: false })
  applicationDate: Date;

  @Prop({ required: false, default: "" })
  notes: string;

  @Prop({ required: false, default: "" })
  addedBy: string;
}

export const FarmInputSchema = SchemaFactory.createForClass(FarmInput);
FarmInputSchema.index({ tenantId: 1 });
FarmInputSchema.index({ cropCycleId: 1 });
FarmInputSchema.index({ category: 1 });
