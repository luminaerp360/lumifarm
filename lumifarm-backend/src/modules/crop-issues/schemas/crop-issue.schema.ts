import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IssueType {
  PEST_INFESTATION = 'pest_infestation',
  DISEASE = 'disease',
  WEATHER_DAMAGE = 'weather_damage',
  SOIL_DEFICIENCY = 'soil_deficiency',
  WATER_STRESS = 'water_stress',
  FLOOD = 'flood',
  DROUGHT = 'drought',
  EQUIPMENT_FAILURE = 'equipment_failure',
  LABOR_SHORTAGE = 'labor_shortage',
  OTHER = 'other',
}

export enum IssueStatus {
  REPORTED = 'reported',
  IN_TREATMENT = 'in_treatment',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Schema({ timestamps: true })
export class CropIssue extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: false, default: '' })
  farmId: string;

  @Prop({ required: false, default: '' })
  plotId: string;

  @Prop({ required: false, default: '' })
  cropCycleId: string;

  @Prop({ type: String, enum: IssueType, default: IssueType.OTHER })
  issueType: IssueType;

  @Prop({ type: String, enum: IssueSeverity, default: IssueSeverity.MEDIUM })
  severity: IssueSeverity;

  @Prop({ type: String, enum: IssueStatus, default: IssueStatus.REPORTED })
  status: IssueStatus;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: '' })
  affectedArea: string; // Percentage or area description

  @Prop({ required: false, default: '' })
  diagnosis: string;

  @Prop({ required: false, default: '' })
  remedialMeasure: string;

  @Prop({ required: false, default: 0 })
  costToFix: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ required: false })
  reportedDate: Date;

  @Prop({ required: false })
  treatedDate: Date;

  @Prop({ required: false })
  resolvedDate: Date;

  @Prop({ required: false, default: '' })
  reportedBy: string; // Worker/User ID

  @Prop({ required: false, default: '' })
  treatedBy: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: false, default: '' })
  notes: string;

  @Prop({ required: false, default: '' })
  pestName: string; // For pest infestation

  @Prop({ required: false, default: '' })
  diseaseName: string; // For disease

  @Prop({ required: false, default: '' })
  chemicalUsed: string; // For treatment
}

export const CropIssueSchema = SchemaFactory.createForClass(CropIssue);
CropIssueSchema.index({ tenantId: 1 });
CropIssueSchema.index({ farmId: 1 });
CropIssueSchema.index({ plotId: 1 });
CropIssueSchema.index({ status: 1 });
CropIssueSchema.index({ severity: 1 });
CropIssueSchema.index({ issueType: 1 });
