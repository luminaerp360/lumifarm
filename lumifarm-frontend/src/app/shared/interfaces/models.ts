// ─── Properties ─── //
export type PropertyType =
  | "apartment"
  | "house"
  | "commercial"
  | "land"
  | "bedsitter"
  | "single_room"
  | "one_bedroom"
  | "two_bedroom"
  | "three_bedroom";
export type PropertyStatus =
  | "available"
  | "occupied"
  | "maintenance"
  | "unavailable";

export interface Property {
  _id: string;
  tenantId: string;
  name: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  city: string;
  county: string;
  rentAmount: number;
  depositAmount: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  amenities: string[];
  images: string[];
  unitNumber: string;
  floor: number;
  buildingName: string;
  managerId: string;
  currentTenantId: string;
  currentLeaseId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Property Tenants (Rental Occupants) ─── //
export interface PropertyTenant {
  _id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  kraPin: string;
  emergencyContact: { name: string; phone: string; relationship: string };
  occupation: string;
  employer: string;
  avatar: string;
  currentPropertyId: string;
  currentLeaseId: string;
  isActive: boolean;
  documents: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ─── Leases ─── //
export type LeaseStatus =
  | "draft"
  | "active"
  | "expired"
  | "terminated"
  | "renewed";
export type PaymentFrequency =
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "annually";

export interface Lease {
  _id: string;
  tenantId: string;
  propertyId: string;
  propertyTenantId: string;
  leaseNumber: string;
  status: LeaseStatus;
  startDate: string;
  endDate: string;
  rentAmount: number;
  currency: string;
  depositAmount: number;
  depositPaid: boolean;
  paymentFrequency: PaymentFrequency;
  paymentDueDay: number;
  lateFeeAmount: number;
  gracePeriodDays: number;
  terms: string;
  documents: string[];
  terminatedAt: string;
  terminationReason: string;
  renewedFromLeaseId: string;
  propertyName: string;
  propertyTenantName: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Payments ─── //
export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "partial";
export type PaymentMethod =
  | "mpesa"
  | "bank_transfer"
  | "cash"
  | "cheque"
  | "card"
  | "other";
export type PaymentType =
  | "rent"
  | "deposit"
  | "late_fee"
  | "damage"
  | "utility"
  | "other";

export interface Payment {
  _id: string;
  tenantId: string;
  leaseId: string;
  propertyTenantId: string;
  propertyId: string;
  amount: number;
  currency: string;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  status: PaymentStatus;
  mpesaTransactionId: string;
  mpesaPhoneNumber: string;
  bankReference: string;
  chequeNumber: string;
  receiptNumber: string;
  paymentPeriod: string;
  notes: string;
  propertyName: string;
  propertyTenantName: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Farm Finance ─── //
export type TransactionType = "expense" | "income";
export type FinanceExpenseCategory =
  | "seed"
  | "fertilizer"
  | "pesticides"
  | "herbicides"
  | "fungicides"
  | "labor"
  | "water"
  | "equipment"
  | "equipment_hire"
  | "transport"
  | "storage"
  | "utilities"
  | "maintenance"
  | "fuel"
  | "packaging"
  | "irrigation"
  | "land_preparation"
  | "veterinary"
  | "insurance"
  | "land_rent"
  | "other";
export type FinanceIncomeCategory =
  | "crop_sale"
  | "livestock_sale"
  | "produce_sale"
  | "subsidy"
  | "grant"
  | "contract_farming"
  | "rental_income"
  | "other";
export type FinancePaymentStatus =
  | "pending"
  | "paid"
  | "overdue"
  | "partially_paid";
export type FinancePaymentMethod =
  | "cash"
  | "mpesa"
  | "bank_transfer"
  | "cheque"
  | "mobile_money"
  | "on_account"
  | "other";

export interface FarmFinance {
  _id: string;
  tenantId: string;
  farmId: string;
  cropCycleId: string;
  transactionType: TransactionType;
  category: FinanceExpenseCategory | FinanceIncomeCategory;
  description: string;
  amount: number;
  currency: string;
  paymentStatus: FinancePaymentStatus;
  transactionDate: string;
  paidDate: string;
  paymentMethod: FinancePaymentMethod;
  reference: string;
  vendor: string;
  buyer: string;
  quantitySold: number;
  pricePerUnit: number;
  notes: string;
  documents: string[];
  recordedBy: string;
  farmName?: string;
  cropCycleName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalExpenses: number;
  totalIncome: number;
  netProfit: number;
  profitMargin: number | string;
}

// ─── Damages ─── //
export type DamageStatus =
  | "reported"
  | "assessed"
  | "in_repair"
  | "repaired"
  | "deducted"
  | "closed";
export type DamageSeverity = "low" | "medium" | "high" | "critical";
export type DamageType =
  | "structural"
  | "plumbing"
  | "electrical"
  | "appliance"
  | "cosmetic"
  | "fixture"
  | "flooring"
  | "window_door"
  | "other";

export interface Damage {
  _id: string;
  tenantId: string;
  propertyId: string;
  propertyTenantId: string;
  leaseId: string;
  description: string;
  damageType: DamageType;
  severity: DamageSeverity;
  status: DamageStatus;
  estimatedCost: number;
  actualCost: number;
  currency: string;
  reportedDate: string;
  assessedDate: string;
  repairedDate: string;
  images: string[];
  location: string;
  notes: string;
  repairVendor: string;
  deductedFromDeposit: boolean;
  propertyName: string;
  propertyTenantName: string;
  reportedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth & Users ─── //
export type RentiumPermission =
  | "view_dashboard"
  | "view_properties"
  | "create_properties"
  | "edit_properties"
  | "delete_properties"
  | "view_tenants"
  | "create_tenants"
  | "edit_tenants"
  | "delete_tenants"
  | "view_leases"
  | "create_leases"
  | "edit_leases"
  | "delete_leases"
  | "view_payments"
  | "create_payments"
  | "edit_payments"
  | "delete_payments"
  | "view_damages"
  | "create_damages"
  | "edit_damages"
  | "delete_damages"
  | "view_reports"
  | "view_users"
  | "create_users"
  | "edit_users"
  | "delete_users";

export interface RentiumUser {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "manager" | "agent";
  isActive: boolean;
  assignedPropertyIds: string[];
  permissions: RentiumPermission[];
  phone: string;
  googleId?: string;
  avatar?: string;
  isEmailVerified?: boolean;
  isApproved?: boolean;
  authProvider?: "credentials" | "google";
  tenantIds?: string[];
  activeTenantId?: string;
}

export interface PermissionsResponse {
  all: RentiumPermission[];
  defaults: {
    admin: RentiumPermission[];
    manager: RentiumPermission[];
    agent: RentiumPermission[];
  };
}

export interface AuthResponse {
  user: RentiumUser;
  token: string;
  tenants?: Tenant[];
  activeTenantId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── System Tenants (Organizations) ─── //
export type TenantPlan = "free" | "basic" | "pro" | "enterprise";

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  domain: string;
  logoUrl: string;
  isActive: boolean;
  plan: TenantPlan;
  settings: Record<string, any>;
  ownerUserId: string;
  contactEmail: string;
  billingEmail: string;
  maxUsers: number;
  maxProperties: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard / Reports ─── //
export interface DashboardStats {
  properties: {
    total: number;
    available: number;
    occupied: number;
    occupancyRate: number;
  };
  tenants: { total: number; active: number };
  leases: { total: number; active: number; expiringSoonCount: number };
  payments: { total: number; completed: number; pending: number };
  revenue: { monthly: number; total: number };
  damages: { total: number; reported: number };
}

// ─── Crop Cycles ─── //
export type CropCycleStatus =
  | "draft"
  | "active"
  | "growing"
  | "harvesting"
  | "completed"
  | "abandoned";

export interface WeatherRecord {
  condition: string;
  temperature: string;
  rainfall: string;
  soilMoisture?: string;
  humidity?: string;
  notes: string;
}

export interface CropCycle {
  _id: string;
  tenantId: string;
  farmId: string;
  plotId: string;
  farmWorkerId: string;
  farmWorkerName: string;
  managers: CycleManager[];
  cycleNumber: string;
  seasonName: string;
  seasonYear: string;
  status: CropCycleStatus;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate: string;
  cropType: string;
  seedSupplier: string;
  seedVariety: string;
  seedQuantity: number;
  seedUnit: string;
  seedCostPerUnit: number;
  totalSeedCost: number;
  projectedYield: number;
  actualYield: number;
  yieldUnit: string;
  pricePerUnit: number;
  expectedCropValue: number;
  actualCropValue: number;
  currency: string;
  harvestQuality: string;
  storageLocation: string;
  buyerName: string;
  fertilizer: string;
  pesticides: string;
  waterConsumption: number;
  laborCost: number;
  harvestFrequency: string;
  weatherAtPlanting: WeatherRecord;
  soilCondition: string;
  soilPreparationMethod: string;
  totalInputsCost: number;
  totalLaborCost: number;
  totalExpenses: number;
  totalRevenue: number;
  profitOrLoss: number;
  farmingPractices: string;
  pestManagementMethod: string;
  areaPlanted: number;
  expectedYieldPerAcre: number;
  actualYieldPerAcre: number;
  yieldEstimationNotes: string;
  terms: string;
  notes: string;
  documents: string[];
  completedAt: string;
  abandonmentReason: string;
  renewedFromCycleId: string;
  farmName: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Crop Activities ─── //
export type ActivityType =
  | "soil_preparation"
  | "planting"
  | "weeding"
  | "spraying"
  | "fertilizing"
  | "earthing_up"
  | "irrigation"
  | "scouting"
  | "pruning"
  | "harvesting"
  | "post_harvest"
  | "other";
export type ActivityStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "skipped"
  | "overdue";

export interface ActivityInput {
  inputName: string;
  inputType: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
}

export interface CropActivity {
  _id: string;
  tenantId: string;
  cropCycleId: string;
  farmId: string;
  plotId: string;
  activityType: ActivityType;
  title: string;
  description: string;
  status: ActivityStatus;
  scheduledDate: string;
  completedDate: string;
  daysAfterPlanting: number;
  inputs: ActivityInput[];
  workersCount: number;
  laborHours: number;
  laborCost: number;
  assignedWorkerId: string;
  assignedWorkerName: string;
  weather: WeatherRecord;
  totalInputCost: number;
  totalActivityCost: number;
  currency: string;
  notes: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Farm Inputs ─── //
export type InputCategory =
  | "seed"
  | "fertilizer"
  | "pesticide"
  | "herbicide"
  | "fungicide"
  | "insecticide"
  | "manure"
  | "fuel"
  | "equipment_hire"
  | "labor"
  | "transport"
  | "packaging"
  | "irrigation"
  | "land_preparation"
  | "other";

export type InputPaymentMethod =
  | "cash"
  | "mpesa"
  | "bank_transfer"
  | "cheque"
  | "credit"
  | "on_account"
  | "other";

export type InputPaymentStatus = "paid" | "pending" | "partial";

export interface FarmInput {
  _id: string;
  tenantId: string;
  cropCycleId: string;
  farmId: string;
  plotId: string;
  name: string;
  category: InputCategory;
  brand: string;
  supplier: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  paymentMethod: InputPaymentMethod;
  paymentStatus: InputPaymentStatus;
  amountPaid: number;
  receiptNumber: string;
  purchaseDate: string;
  applicationDate: string;
  notes: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmInputSummary {
  totalInputsCost: number;
  totalPaid: number;
  totalPending: number;
  inputCount: number;
  byCategory: { _id: string; total: number; count: number }[];
}

// ─── Cycle Manager ─── //
export interface CycleManager {
  managerId: string;
  managerName: string;
  role: string;
}
