import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum UnitStatus {
  VACANT = 'vacant',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
}

@Schema({ timestamps: true })
export class Unit extends BaseDocument {
  @Prop({ required: true })
  tenantId: string; // System tenant (organization)

  @Prop({ required: true })
  propertyId: string;

  @Prop({ required: true })
  unitNumber: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: String, enum: UnitStatus, default: UnitStatus.VACANT })
  status: UnitStatus;

  @Prop({ required: true })
  rentAmount: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ required: false, default: 0 })
  securityDeposit: number;

  @Prop({ required: false, default: '' })
  currentTenantId: string;

  @Prop({ required: false, default: '' })
  currentLeaseId: string;

  @Prop({ required: false, default: '' })
  currentPropertyTenantId: string; // Keep track of PropertyTenant for backward compatibility
}

export const UnitSchema = SchemaFactory.createForClass(Unit);
UnitSchema.index({ tenantId: 1 });
UnitSchema.index({ propertyId: 1 });
UnitSchema.index({ status: 1 });
UnitSchema.index({ unitNumber: 1, propertyId: 1 }); // Unique unit number per property
