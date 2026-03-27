import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum ActivityType {
  SOIL_PREPARATION = 'soil_preparation',
  PLANTING = 'planting',
  WEEDING = 'weeding',
  SPRAYING = 'spraying',
  FERTILIZING = 'fertilizing',
  EARTHING_UP = 'earthing_up',
  IRRIGATION = 'irrigation',
  SCOUTING = 'scouting',
  PRUNING = 'pruning',
  HARVESTING = 'harvesting',
  POST_HARVEST = 'post_harvest',
  OTHER = 'other',
}

export enum ActivityStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  OVERDUE = 'overdue',
}

@Schema({ timestamps: true })
export class CropActivity extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  cropCycleId: string;

  @Prop({ required: false, default: '' })
  farmId: string;

  @Prop({ required: false, default: '' })
  plotId: string;

  // Activity details
  @Prop({ type: String, enum: ActivityType, default: ActivityType.OTHER })
  activityType: ActivityType;

  @Prop({ required: true })
  title: string; // e.g. "First Spraying - Fungicide"

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: String, enum: ActivityStatus, default: ActivityStatus.SCHEDULED })
  status: ActivityStatus;

  // Scheduling
  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ required: false })
  completedDate: Date;

  @Prop({ required: false, default: 0 })
  daysAfterPlanting: number; // e.g. 21 means "do this 21 days after planting"

  // Inputs used (embedded array)
  @Prop({
    type: [
      {
        inputName: { type: String, default: '' },
        inputType: { type: String, default: '' }, // seed, fertilizer, pesticide, herbicide, fungicide
        quantity: { type: Number, default: 0 },
        unit: { type: String, default: '' }, // kg, litres, bags, sachets
        costPerUnit: { type: Number, default: 0 },
        totalCost: { type: Number, default: 0 },
      },
    ],
    default: [],
  })
  inputs: {
    inputName: string;
    inputType: string;
    quantity: number;
    unit: string;
    costPerUnit: number;
    totalCost: number;
  }[];

  // Labor
  @Prop({ required: false, default: 0 })
  workersCount: number;

  @Prop({ required: false, default: 0 })
  laborHours: number;

  @Prop({ required: false, default: 0 })
  laborCost: number;

  @Prop({ required: false, default: '' })
  assignedWorkerId: string;

  @Prop({ required: false, default: '' })
  assignedWorkerName: string;

  // Weather conditions during activity
  @Prop({
    type: {
      condition: { type: String, default: '' }, // sunny, cloudy, rainy, cold, hot
      temperature: { type: String, default: '' },
      rainfall: { type: String, default: '' }, // none, light, moderate, heavy
      humidity: { type: String, default: '' },
      notes: { type: String, default: '' },
    },
    default: {},
  })
  weather: {
    condition: string;
    temperature: string;
    rainfall: string;
    humidity: string;
    notes: string;
  };

  // Cost summary
  @Prop({ required: false, default: 0 })
  totalInputCost: number;

  @Prop({ required: false, default: 0 })
  totalActivityCost: number; // inputs + labor + other

  @Prop({ required: false, default: 'KES' })
  currency: string;

  @Prop({ required: false, default: '' })
  notes: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export const CropActivitySchema = SchemaFactory.createForClass(CropActivity);
