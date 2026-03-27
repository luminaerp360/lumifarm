import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '../../database/schemas/base.schema';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskCategory {
  SOIL_PREPARATION = 'soil_preparation',
  PLANTING = 'planting',
  WEEDING = 'weeding',
  SPRAYING = 'spraying',
  FERTILIZING = 'fertilizing',
  IRRIGATION = 'irrigation',
  HARVESTING = 'harvesting',
  EQUIPMENT_MAINTENANCE = 'equipment_maintenance',
  FENCING = 'fencing',
  GENERAL = 'general',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Task extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ type: String, enum: TaskCategory, default: TaskCategory.GENERAL })
  category: TaskCategory;

  // Scheduling
  @Prop({ required: false })
  dueDate: Date;

  @Prop({ required: false })
  startDate: Date;

  @Prop({ required: false })
  completedDate: Date;

  // Assignment
  @Prop({ required: false, default: '' })
  assignedToId: string;

  @Prop({ required: false, default: '' })
  assignedToName: string;

  // Links
  @Prop({ required: false, default: '' })
  farmId: string;

  @Prop({ required: false, default: '' })
  farmName: string;

  @Prop({ required: false, default: '' })
  plotId: string;

  @Prop({ required: false, default: '' })
  plotName: string;

  @Prop({ required: false, default: '' })
  cropCycleId: string;

  @Prop({ required: false, default: '' })
  cropCycleName: string;

  // Cost
  @Prop({ required: false, default: 0 })
  estimatedCost: number;

  @Prop({ required: false, default: 0 })
  actualCost: number;

  @Prop({ required: false, default: 'KES' })
  currency: string;

  // Time tracking
  @Prop({ required: false, default: 0 })
  estimatedHours: number;

  @Prop({ required: false, default: 0 })
  actualHours: number;

  @Prop({ required: false, default: '' })
  notes: string;

  @Prop({ required: false, default: '' })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ tenantId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ assignedToId: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ cropCycleId: 1 });
