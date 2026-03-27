import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum WorkerRole {
  OWNER = 'owner',
  MANAGER = 'manager',
  WORKER = 'worker',
  SPECIALIST = 'specialist',
  CONTRACTOR = 'contractor',
}

export enum WorkerSpecialization {
  GENERAL = 'general',
  CROP_EXPERT = 'crop_expert',
  SOIL_EXPERT = 'soil_expert',
  PEST_CONTROL = 'pest_control',
  IRRIGATION = 'irrigation',
  EQUIPMENT_OPERATOR = 'equipment_operator',
  VETERINARY = 'veterinary',
}

@Schema({ timestamps: true })
export class FarmWorker extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: false, default: '' })
  farmId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ type: String, enum: WorkerRole, default: WorkerRole.WORKER })
  role: WorkerRole;

  @Prop({ type: String, enum: WorkerSpecialization, default: WorkerSpecialization.GENERAL })
  specialization: WorkerSpecialization;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false, default: '' })
  email: string;

  @Prop({ required: false, default: '' })
  nationalId: string;

  @Prop({ required: false })
  joinDate: Date;

  @Prop({ required: false })
  leaveDate: Date;

  @Prop({ required: false, default: false })
  isActive: boolean;

  @Prop({ required: false, default: '' })
  availability: string; // e.g., "full_time", "part_time", "seasonal"

  @Prop({ required: false, default: '' })
  address: string;

  @Prop({ required: false, default: 0 })
  monthlyWage: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ required: false, default: '' })
  skills: string;

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({ required: false, default: '' })
  healthInsuranceNumber: string;
}

export const FarmWorkerSchema = SchemaFactory.createForClass(FarmWorker);
FarmWorkerSchema.index({ tenantId: 1 });
FarmWorkerSchema.index({ farmId: 1 });
FarmWorkerSchema.index({ isActive: 1 });
FarmWorkerSchema.index({ role: 1 });
