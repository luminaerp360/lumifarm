import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum CropCycleStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  GROWING = 'growing',
  HARVESTING = 'harvesting',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum HarvestFrequency {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUALLY = 'semi_annually',
  ANNUALLY = 'annually',
}

@Schema({ timestamps: true })
export class CropCycle extends BaseDocument {
  @Prop({ required: true })
  tenantId: string; // System tenant (organization)

  @Prop({ required: false, default: '' })
  farmId: string;

  @Prop({ required: false, default: '' })
  plotId: string;

  @Prop({ required: true })
  farmWorkerId: string; // The worker/operator managing this cycle

  @Prop({ required: false, default: '' })
  cycleNumber: string;

  @Prop({ type: String, enum: CropCycleStatus, default: CropCycleStatus.DRAFT })
  status: CropCycleStatus;

  @Prop({ required: true })
  plantingDate: Date;

  @Prop({ required: true })
  expectedHarvestDate: Date;

  @Prop({ required: false })
  actualHarvestDate: Date;

  @Prop({ required: true })
  cropType: string;

  @Prop({ required: false, default: '' })
  seedSupplier: string;

  @Prop({ required: false, default: '' })
  seedVariety: string;

  @Prop({ required: false, default: 0 })
  projectedYield: number; // in kg or units

  @Prop({ required: false, default: 0 })
  actualYield: number;

  @Prop({ required: false, default: 0 })
  expectedCropValue: number;

  @Prop({ required: false, default: 0 })
  actualCropValue: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ required: false, default: 0 })
  fertilizer: string;

  @Prop({ required: false, default: 0 })
  pesticides: string;

  @Prop({ required: false, default: 0 })
  waterConsumption: number; // in liters

  @Prop({ required: false, default: 0 })
  laborCost: number;

  @Prop({ type: String, enum: HarvestFrequency, default: HarvestFrequency.ANNUALLY })
  harvestFrequency: HarvestFrequency;

  @Prop({ required: false, default: '' })
  terms: string;

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({ required: false })
  completedAt: Date;

  @Prop({ required: false, default: '' })
  abandonmentReason: string;

  @Prop({ required: false, default: '' })
  renewedFromCycleId: string;

  @Prop({ required: false, default: '' })
  farmName: string;

  @Prop({ required: false, default: '' })
  farmWorkerName: string;

  // Crop practice notes
  @Prop({ required: false, default: '' })
  farmingPractices: string;

  @Prop({ required: false, default: '' })
  pestManagementMethod: string;

  @Prop({ required: false, default: '' })
  notes: string;
}

export const CropCycleSchema = SchemaFactory.createForClass(CropCycle);
CropCycleSchema.index({ tenantId: 1 });
CropCycleSchema.index({ farmId: 1 });
CropCycleSchema.index({ plotId: 1 });
CropCycleSchema.index({ status: 1 });
CropCycleSchema.index({ farmWorkerId: 1 });
