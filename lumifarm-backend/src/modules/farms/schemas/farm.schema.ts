import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum FarmType {
  VEGETABLE_FARM = 'vegetable_farm',
  DAIRY_FARM = 'dairy_farm',
  GRAIN_FARM = 'grain_farm',
  COFFEE_FARM = 'coffee_farm',
  ORCHARD = 'orchard',
  POULTRY_FARM = 'poultry_farm',
  MIXED_FARMING = 'mixed_farming',
  AQUACULTURE = 'aquaculture',
  GREENHOUSE = 'greenhouse',
}

export enum FarmStatus {
  UNDER_CULTIVATION = 'under_cultivation',
  FALLOW = 'fallow',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}

export enum SoilType {
  SANDY = 'sandy',
  CLAYEY = 'clayey',
  LOAMY = 'loamy',
  SILTY = 'silty',
  PEAT = 'peat',
}

export enum IrrigationType {
  DRIP = 'drip',
  SPRINKLER = 'sprinkler',
  FLOOD = 'flood',
  RAINWATER = 'rainwater',
  WELL = 'well',
  NONE = 'none',
}

@Schema({ timestamps: true })
export class Farm extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: String, enum: FarmType, default: FarmType.MIXED_FARMING })
  type: FarmType;

  @Prop({ type: String, enum: FarmStatus, default: FarmStatus.UNDER_CULTIVATION })
  status: FarmStatus;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false, default: '' })
  city: string;

  @Prop({ required: false, default: '' })
  county: string;

  @Prop({ required: true, default: 0 })
  totalAcreage: number;

  @Prop({ type: String, enum: SoilType, default: SoilType.LOAMY })
  soilType: SoilType;

  @Prop({ type: String, enum: IrrigationType, default: IrrigationType.RAINWATER })
  irrationType: IrrigationType;

  @Prop({ type: [String], default: [] })
  dominantCrops: string[];

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: false, default: '' })
  managerId: string;

  @Prop({ required: false, default: '' })
  ownerName: string;

  @Prop({ required: false, default: '' })
  ownerPhone: string;

  @Prop({ required: false, default: '' })
  ownerEmail: string;

  // Geolocation data
  @Prop({ required: false, default: 0 })
  latitude: number;

  @Prop({ required: false, default: 0 })
  longitude: number;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
FarmSchema.index({ tenantId: 1 });
FarmSchema.index({ status: 1 });
FarmSchema.index({ type: 1 });
FarmSchema.index({ city: 1, county: 1 });
