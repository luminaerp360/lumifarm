import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum PropertyType {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  COMMERCIAL = 'commercial',
  LAND = 'land',
  BEDSITTER = 'bedsitter',
  SINGLE_ROOM = 'single_room',
  ONE_BEDROOM = 'one_bedroom',
  TWO_BEDROOM = 'two_bedroom',
  THREE_BEDROOM = 'three_bedroom',
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

@Schema({ timestamps: true })
export class Property extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: String, enum: PropertyType, default: PropertyType.APARTMENT })
  type: PropertyType;

  @Prop({ type: String, enum: PropertyStatus, default: PropertyStatus.AVAILABLE })
  status: PropertyStatus;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false, default: '' })
  city: string;

  @Prop({ required: false, default: '' })
  county: string;

  @Prop({ required: false, default: 0 })
  rentAmount: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ required: false, default: 0 })
  depositAmount: number;

  @Prop({ required: false, default: 0 })
  bedrooms: number;

  @Prop({ required: false, default: 0 })
  bathrooms: number;

  @Prop({ required: false, default: 0 })
  squareFootage: number;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: false, default: '' })
  unitNumber: string;

  @Prop({ required: false, default: '' })
  floor: string;

  @Prop({ required: false, default: '' })
  buildingName: string;

  @Prop({ required: false, default: '' })
  managerId: string;

  // ─── NOTE: currentTenantId and currentLeaseId moved to Unit schema ───────
  // Properties no longer track occupancy directly; units do.
}

export const PropertySchema = SchemaFactory.createForClass(Property);
PropertySchema.index({ tenantId: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ type: 1 });
PropertySchema.index({ city: 1, county: 1 });
