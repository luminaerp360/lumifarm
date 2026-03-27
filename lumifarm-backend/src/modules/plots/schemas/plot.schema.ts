import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum PlotStatus {
  PLANTED = 'planted',
  VACANT = 'vacant',
  FALLOW = 'fallow',
  UNDER_PREPARATION = 'under_preparation',
  HARVESTED = 'harvested',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true })
export class Plot extends BaseDocument {
  @Prop({ required: true })
  tenantId: string; // System tenant (organization)

  @Prop({ required: true })
  farmId: string;

  @Prop({ required: true })
  plotNumber: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: String, enum: PlotStatus, default: PlotStatus.VACANT })
  status: PlotStatus;

  @Prop({ required: true, default: 0 })
  areaInAcres: number;

  @Prop({ required: false, default: '' })
  cropType: string;

  @Prop({ required: false, default: '' })
  currentCropCycleId: string;

  @Prop({ required: false })
  lastPlantedDate: Date;

  @Prop({ required: false })
  lastHarvestedDate: Date;

  @Prop({ required: false, default: '' })
  soilQuality: string;

  @Prop({ required: false, default: 0 })
  costToOperatePerCycle: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const PlotSchema = SchemaFactory.createForClass(Plot);
PlotSchema.index({ tenantId: 1 });
PlotSchema.index({ farmId: 1 });
PlotSchema.index({ status: 1 });
PlotSchema.index({ plotNumber: 1, farmId: 1 });
