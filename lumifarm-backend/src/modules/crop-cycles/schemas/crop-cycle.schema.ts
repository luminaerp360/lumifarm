import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseDocument } from "../../database/schemas/base.schema";

export enum CropCycleStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  GROWING = "growing",
  HARVESTING = "harvesting",
  COMPLETED = "completed",
  ABANDONED = "abandoned",
}

export enum HarvestFrequency {
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  SEMI_ANNUALLY = "semi_annually",
  ANNUALLY = "annually",
}

@Schema({ timestamps: true })
export class CropCycle extends BaseDocument {
  @Prop({ required: true })
  tenantId: string; // System tenant (organization)

  @Prop({ required: false, default: "" })
  farmId: string;

  @Prop({ required: false, default: "" })
  plotId: string;

  @Prop({ required: true })
  farmWorkerId: string; // The primary worker/operator

  @Prop({ required: false, default: "" })
  farmWorkerName: string;

  // Managers / supervisors
  @Prop({
    type: [{ managerId: String, managerName: String, role: String }],
    default: [],
  })
  managers: { managerId: string; managerName: string; role: string }[];

  @Prop({ required: false, default: "" })
  cycleNumber: string;

  // Season tracking
  @Prop({ required: false, default: "" })
  seasonName: string; // e.g. "Long Rains 2026", "Short Rains 2026", "Dry Season 2026"

  @Prop({ required: false, default: "" })
  seasonYear: string;

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

  @Prop({ required: false, default: "" })
  seedSupplier: string;

  @Prop({ required: false, default: "" })
  seedVariety: string;

  @Prop({ required: false, default: 0 })
  projectedYield: number;

  @Prop({ required: false, default: 0 })
  actualYield: number;

  @Prop({ required: false, default: 0 })
  expectedCropValue: number;

  @Prop({ required: false, default: 0 })
  actualCropValue: number;

  // Yield estimation breakdown
  @Prop({ required: false, default: 0 })
  areaPlanted: number; // in acres

  @Prop({ required: false, default: 0 })
  expectedYieldPerAcre: number;

  @Prop({ required: false, default: 0 })
  actualYieldPerAcre: number;

  @Prop({ required: false, default: "" })
  yieldEstimationNotes: string;

  @Prop({ required: false, default: "KES" })
  currency: string;

  @Prop({ required: false, default: 0 })
  fertilizer: string;

  @Prop({ required: false, default: 0 })
  pesticides: string;

  @Prop({ required: false, default: 0 })
  waterConsumption: number; // in liters

  @Prop({ required: false, default: 0 })
  laborCost: number;

  @Prop({
    type: String,
    enum: HarvestFrequency,
    default: HarvestFrequency.ANNUALLY,
  })
  harvestFrequency: HarvestFrequency;

  @Prop({ required: false, default: "" })
  terms: string;

  @Prop({ type: [String], default: [] })
  documents: string[];

  @Prop({ required: false })
  completedAt: Date;

  @Prop({ required: false, default: "" })
  abandonmentReason: string;

  @Prop({ required: false, default: "" })
  renewedFromCycleId: string;

  @Prop({ required: false, default: "" })
  farmName: string;

  // Crop practice notes
  @Prop({ required: false, default: "" })
  farmingPractices: string;

  @Prop({ required: false, default: "" })
  pestManagementMethod: string;

  @Prop({ required: false, default: "" })
  notes: string;

  // Weather at planting
  @Prop({
    type: {
      condition: { type: String, default: "" },
      temperature: { type: String, default: "" },
      rainfall: { type: String, default: "" },
      soilMoisture: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    default: {},
  })
  weatherAtPlanting: {
    condition: string;
    temperature: string;
    rainfall: string;
    soilMoisture: string;
    notes: string;
  };

  // Soil condition at start
  @Prop({ required: false, default: "" })
  soilCondition: string;

  @Prop({ required: false, default: "" })
  soilPreparationMethod: string; // plowing, harrowing, ridging

  // Seed details
  @Prop({ required: false, default: 0 })
  seedQuantity: number;

  @Prop({ required: false, default: "" })
  seedUnit: string; // kg, bags

  @Prop({ required: false, default: 0 })
  seedCostPerUnit: number;

  @Prop({ required: false, default: 0 })
  totalSeedCost: number;

  // Computed totals (updated when activities are completed)
  @Prop({ required: false, default: 0 })
  totalInputsCost: number;

  @Prop({ required: false, default: 0 })
  totalLaborCost: number;

  @Prop({ required: false, default: 0 })
  totalExpenses: number;

  @Prop({ required: false, default: 0 })
  totalRevenue: number;

  @Prop({ required: false, default: 0 })
  profitOrLoss: number;

  // Harvest details
  @Prop({ required: false, default: "" })
  yieldUnit: string; // kg, bags, tonnes

  @Prop({ required: false, default: 0 })
  pricePerUnit: number;

  @Prop({ required: false, default: "" })
  harvestQuality: string; // grade A, grade B, mixed

  @Prop({ required: false, default: "" })
  storageLocation: string;

  @Prop({ required: false, default: "" })
  buyerName: string;
}

export const CropCycleSchema = SchemaFactory.createForClass(CropCycle);
CropCycleSchema.index({ tenantId: 1 });
CropCycleSchema.index({ farmId: 1 });
CropCycleSchema.index({ plotId: 1 });
CropCycleSchema.index({ status: 1 });
CropCycleSchema.index({ farmWorkerId: 1 });
