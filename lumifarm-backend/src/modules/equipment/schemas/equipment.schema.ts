import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseDocument } from "../../database/schemas/base.schema";

export enum EquipmentCategory {
  TRACTOR = "tractor",
  SPRAYER = "sprayer",
  PLOUGH = "plough",
  HARROW = "harrow",
  SEEDER = "seeder",
  HARVESTER = "harvester",
  IRRIGATION_PUMP = "irrigation_pump",
  WATER_TANK = "water_tank",
  TRAILER = "trailer",
  VEHICLE = "vehicle",
  GENERATOR = "generator",
  HAND_TOOL = "hand_tool",
  POWER_TOOL = "power_tool",
  STORAGE = "storage",
  OTHER = "other",
}

export enum EquipmentStatus {
  OPERATIONAL = "operational",
  MAINTENANCE = "maintenance",
  REPAIR = "repair",
  IDLE = "idle",
  RETIRED = "retired",
}

export enum EquipmentCondition {
  EXCELLENT = "excellent",
  GOOD = "good",
  FAIR = "fair",
  POOR = "poor",
}

@Schema({ timestamps: true })
export class Equipment extends BaseDocument {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: EquipmentCategory,
    default: EquipmentCategory.OTHER,
  })
  category: EquipmentCategory;

  @Prop({ required: false, default: "" })
  brand: string;

  @Prop({ required: false, default: "" })
  modelName: string;

  @Prop({ required: false, default: "" })
  serialNumber: string;

  @Prop({
    type: String,
    enum: EquipmentStatus,
    default: EquipmentStatus.OPERATIONAL,
  })
  status: EquipmentStatus;

  @Prop({
    type: String,
    enum: EquipmentCondition,
    default: EquipmentCondition.GOOD,
  })
  condition: EquipmentCondition;

  // Location
  @Prop({ required: false, default: "" })
  farmId: string;

  @Prop({ required: false, default: "" })
  farmName: string;

  @Prop({ required: false, default: "" })
  assignedToId: string;

  @Prop({ required: false, default: "" })
  assignedToName: string;

  // Purchase info
  @Prop({ required: false })
  purchaseDate: Date;

  @Prop({ required: false, default: 0 })
  purchasePrice: number;

  @Prop({ required: false, default: 0 })
  currentValue: number;

  @Prop({ required: false, default: "KES" })
  currency: string;

  // Specifications
  @Prop({ required: false, default: "" })
  fuelType: string; // diesel, petrol, electric, manual, solar

  @Prop({ required: false, default: "" })
  enginePower: string; // e.g. "75 HP"

  @Prop({ required: false, default: "" })
  capacity: string; // e.g. "500 litres", "2 tonnes"

  // Maintenance
  @Prop({ required: false })
  lastMaintenanceDate: Date;

  @Prop({ required: false })
  nextMaintenanceDate: Date;

  @Prop({ required: false, default: 0 })
  totalMaintenanceCost: number;

  @Prop({
    type: [
      {
        date: Date,
        description: String,
        cost: Number,
        performedBy: String,
        type: String, // routine, repair, overhaul
      },
    ],
    default: [],
  })
  maintenanceHistory: {
    date: Date;
    description: string;
    cost: number;
    performedBy: string;
    type: string;
  }[];

  // Insurance & Documents
  @Prop({ required: false, default: "" })
  insuranceProvider: string;

  @Prop({ required: false })
  insuranceExpiry: Date;

  @Prop({ required: false, default: "" })
  registrationNumber: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: false, default: "" })
  notes: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
EquipmentSchema.index({ tenantId: 1 });
EquipmentSchema.index({ category: 1 });
EquipmentSchema.index({ status: 1 });
EquipmentSchema.index({ farmId: 1 });
