import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";
import { CropActivitiesService } from "../../../shared/services/crop-activities/crop-activities.service";
import { FarmFinanceService } from "../../../shared/services/farm-finance/farm-finance.service";
import { FarmInputsService } from "../../../shared/services/farm-inputs/farm-inputs.service";
import { FarmWorkersService } from "../../../shared/services/farm-workers/farm-workers.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import {
  CropCycle,
  CropActivity,
  FarmInput,
  FarmInputSummary,
} from "../../../shared/interfaces/models";

@Component({
  selector: "app-crop-cycle-detail",
  templateUrl: "./crop-cycle-detail.component.html",
  styleUrls: ["./crop-cycle-detail.component.scss"],
})
export class CropCycleDetailComponent implements OnInit {
  cycle: CropCycle | null = null;
  activities: CropActivity[] = [];
  expenses: any[] = [];
  farmInputs: FarmInput[] = [];
  inputSummary: FarmInputSummary | null = null;
  workers: any[] = [];
  loading = true;
  activeTab: "timeline" | "inputs" | "expenses" | "harvest" = "timeline";

  // Activity form
  showActivityForm = false;
  showCompleteForm = false;
  selectedActivity: CropActivity | null = null;
  activityForm: any = this.getEmptyActivityForm();

  // Farm Input form
  showInputForm = false;
  editingInput: FarmInput | null = null;
  inputForm: any = this.getEmptyInputForm();

  // Manager form
  showManagerForm = false;
  managerForm = { managerId: "", managerName: "", role: "supervisor" };

  activityTypes = [
    {
      value: "soil_preparation",
      label: "Soil Preparation",
      icon: "fas fa-mountain",
    },
    { value: "planting", label: "Planting", icon: "fas fa-seedling" },
    { value: "weeding", label: "Weeding", icon: "fas fa-leaf" },
    { value: "spraying", label: "Spraying", icon: "fas fa-spray-can" },
    { value: "fertilizing", label: "Fertilizing", icon: "fas fa-flask" },
    { value: "earthing_up", label: "Earthing Up", icon: "fas fa-mountain" },
    { value: "irrigation", label: "Irrigation", icon: "fas fa-tint" },
    {
      value: "scouting",
      label: "Scouting / Monitoring",
      icon: "fas fa-search",
    },
    { value: "pruning", label: "Pruning", icon: "fas fa-cut" },
    { value: "harvesting", label: "Harvesting", icon: "fas fa-truck-loading" },
    { value: "post_harvest", label: "Post-Harvest", icon: "fas fa-warehouse" },
    { value: "other", label: "Other", icon: "fas fa-ellipsis-h" },
  ];

  inputCategories = [
    { value: "seed", label: "Seed", icon: "fas fa-seedling" },
    { value: "fertilizer", label: "Fertilizer", icon: "fas fa-flask" },
    { value: "pesticide", label: "Pesticide", icon: "fas fa-spray-can" },
    { value: "herbicide", label: "Herbicide", icon: "fas fa-leaf" },
    { value: "fungicide", label: "Fungicide", icon: "fas fa-shield-alt" },
    { value: "insecticide", label: "Insecticide", icon: "fas fa-bug" },
    { value: "manure", label: "Manure", icon: "fas fa-recycle" },
    { value: "fuel", label: "Fuel", icon: "fas fa-gas-pump" },
    {
      value: "equipment_hire",
      label: "Equipment Hire",
      icon: "fas fa-tractor",
    },
    { value: "labor", label: "Labor", icon: "fas fa-users" },
    { value: "transport", label: "Transport", icon: "fas fa-truck" },
    { value: "packaging", label: "Packaging", icon: "fas fa-box" },
    { value: "irrigation", label: "Irrigation", icon: "fas fa-tint" },
    {
      value: "land_preparation",
      label: "Land Preparation",
      icon: "fas fa-mountain",
    },
    { value: "other", label: "Other", icon: "fas fa-ellipsis-h" },
  ];

  paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "mpesa", label: "M-Pesa" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
    { value: "credit", label: "Credit" },
    { value: "on_account", label: "On Account" },
    { value: "other", label: "Other" },
  ];

  paymentStatuses = [
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
  ];

  inputTypes = [
    "seed",
    "fertilizer",
    "pesticide",
    "herbicide",
    "fungicide",
    "insecticide",
    "fuel",
    "other",
  ];

  managerRoles = [
    "supervisor",
    "manager",
    "agronomist",
    "foreman",
    "team_lead",
    "consultant",
  ];

  inputCategoryFilter = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cropCyclesService: CropCyclesService,
    private cropActivitiesService: CropActivitiesService,
    private farmFinanceService: FarmFinanceService,
    private farmInputsService: FarmInputsService,
    private farmWorkersService: FarmWorkersService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.load(id);
    this.farmWorkersService.getAll(1, 100).subscribe({
      next: (res) => (this.workers = res.data),
    });
  }

  load(id: string): void {
    this.cropCyclesService.getById(id).subscribe({
      next: (c: any) => {
        this.cycle = c;
        this.loading = false;
        this.loadActivities(id);
        this.loadExpenses(id);
        this.loadFarmInputs(id);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadActivities(cycleId: string): void {
    this.cropActivitiesService.getByCropCycle(cycleId).subscribe({
      next: (acts) => (this.activities = acts),
    });
  }

  loadExpenses(cycleId: string): void {
    this.farmFinanceService.getAll(1, 100, "", "", "").subscribe({
      next: (res: any) => {
        this.expenses = (res.data || []).filter(
          (e: any) => e.cropCycleId === cycleId,
        );
      },
    });
  }

  loadFarmInputs(cycleId: string): void {
    this.farmInputsService.getByCropCycle(cycleId).subscribe({
      next: (inputs) => (this.farmInputs = inputs),
    });
    this.farmInputsService.getSummary(cycleId).subscribe({
      next: (summary) => (this.inputSummary = summary),
    });
  }

  goBack(): void {
    this.router.navigate(["/crop-cycles"]);
  }

  // ── Status helpers ──
  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
      active:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      growing:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      harvesting:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      abandoned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] || "";
  }

  getActivityStatusClasses(status: string): string {
    const map: Record<string, string> = {
      scheduled:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      in_progress:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      skipped:
        "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] || "";
  }

  getPaymentStatusClasses(status: string): string {
    const map: Record<string, string> = {
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      partial:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    };
    return map[status] || "";
  }

  getActivityIcon(type: string): string {
    return (
      this.activityTypes.find((t) => t.value === type)?.icon || "fas fa-tasks"
    );
  }

  getActivityLabel(type: string): string {
    return this.activityTypes.find((t) => t.value === type)?.label || type;
  }

  getCategoryLabel(cat: string): string {
    return this.inputCategories.find((c) => c.value === cat)?.label || cat;
  }

  getCategoryIcon(cat: string): string {
    return (
      this.inputCategories.find((c) => c.value === cat)?.icon || "fas fa-box"
    );
  }

  getDaysFromPlanting(date: string): number {
    if (!this.cycle) return 0;
    const planting = new Date(this.cycle.plantingDate).getTime();
    const target = new Date(date).getTime();
    return Math.round((target - planting) / (1000 * 60 * 60 * 24));
  }

  getCycleProgress(): number {
    if (!this.cycle) return 0;
    const start = new Date(this.cycle.plantingDate).getTime();
    const end = new Date(this.cycle.expectedHarvestDate).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  getCompletedActivities(): number {
    return this.activities.filter((a) => a.status === "completed").length;
  }

  getTotalActivityCost(): number {
    return this.activities.reduce(
      (sum, a) => sum + (a.totalActivityCost || 0),
      0,
    );
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }

  getTotalInputsCost(): number {
    return this.inputSummary?.totalInputsCost || 0;
  }

  getAllExpensesTotal(): number {
    return (
      (this.cycle?.totalSeedCost || 0) +
      this.getTotalActivityCost() +
      this.getTotalExpenses() +
      this.getTotalInputsCost()
    );
  }

  get filteredInputs(): FarmInput[] {
    if (!this.inputCategoryFilter) return this.farmInputs;
    return this.farmInputs.filter(
      (i) => i.category === this.inputCategoryFilter,
    );
  }

  // ── Farm Input CRUD ──
  getEmptyInputForm(): any {
    return {
      name: "",
      category: "fertilizer",
      brand: "",
      supplier: "",
      quantity: 0,
      unit: "kg",
      unitPrice: 0,
      totalAmount: 0,
      paymentMethod: "cash",
      paymentStatus: "paid",
      amountPaid: 0,
      receiptNumber: "",
      purchaseDate: "",
      applicationDate: "",
      notes: "",
    };
  }

  openInputForm(input?: FarmInput): void {
    if (input) {
      this.editingInput = input;
      this.inputForm = {
        name: input.name,
        category: input.category,
        brand: input.brand,
        supplier: input.supplier,
        quantity: input.quantity,
        unit: input.unit,
        unitPrice: input.unitPrice,
        totalAmount: input.totalAmount,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentStatus,
        amountPaid: input.amountPaid,
        receiptNumber: input.receiptNumber,
        purchaseDate: input.purchaseDate
          ? new Date(input.purchaseDate).toISOString().split("T")[0]
          : "",
        applicationDate: input.applicationDate
          ? new Date(input.applicationDate).toISOString().split("T")[0]
          : "",
        notes: input.notes,
      };
    } else {
      this.editingInput = null;
      this.inputForm = this.getEmptyInputForm();
    }
    this.showInputForm = true;
  }

  calculateInputAmount(): void {
    this.inputForm.totalAmount =
      (this.inputForm.quantity || 0) * (this.inputForm.unitPrice || 0);
    if (this.inputForm.paymentStatus === "paid") {
      this.inputForm.amountPaid = this.inputForm.totalAmount;
    }
  }

  saveInput(): void {
    if (!this.cycle) return;
    const data = {
      ...this.inputForm,
      cropCycleId: this.cycle._id,
      farmId: this.cycle.farmId,
      plotId: this.cycle.plotId,
    };
    const obs = this.editingInput
      ? this.farmInputsService.update(this.editingInput._id, data)
      : this.farmInputsService.create(data);
    obs.subscribe({
      next: () => {
        this.showInputForm = false;
        this.editingInput = null;
        this.loadFarmInputs(this.cycle!._id);
      },
    });
  }

  deleteInput(input: FarmInput): void {
    if (!confirm("Delete this farm input?")) return;
    this.farmInputsService.delete(input._id).subscribe({
      next: () => this.loadFarmInputs(this.cycle!._id),
    });
  }

  // ── Manager CRUD ──
  openManagerForm(): void {
    this.managerForm = { managerId: "", managerName: "", role: "supervisor" };
    this.showManagerForm = true;
  }

  onManagerWorkerChange(): void {
    const w = this.workers.find(
      (w: any) => w._id === this.managerForm.managerId,
    );
    if (w) this.managerForm.managerName = w.fullName;
  }

  saveManager(): void {
    if (!this.cycle || !this.managerForm.managerName) return;
    const managers = [...(this.cycle.managers || []), { ...this.managerForm }];
    this.cropCyclesService
      .update(this.cycle._id, { managers } as any)
      .subscribe({
        next: (c: any) => {
          this.cycle = c;
          this.showManagerForm = false;
        },
      });
  }

  removeManager(index: number): void {
    if (!this.cycle) return;
    const managers = [...(this.cycle.managers || [])];
    managers.splice(index, 1);
    this.cropCyclesService
      .update(this.cycle._id, { managers } as any)
      .subscribe({
        next: (c: any) => (this.cycle = c),
      });
  }

  // ── Activity CRUD ──
  getEmptyActivityForm(): any {
    return {
      activityType: "spraying",
      title: "",
      description: "",
      scheduledDate: "",
      daysAfterPlanting: 0,
      inputs: [],
      workersCount: 0,
      laborHours: 0,
      laborCost: 0,
      assignedWorkerName: "",
      weather: {
        condition: "",
        temperature: "",
        rainfall: "",
        humidity: "",
        notes: "",
      },
      notes: "",
    };
  }

  openActivityForm(): void {
    this.activityForm = this.getEmptyActivityForm();
    this.showActivityForm = true;
  }

  addInput(): void {
    this.activityForm.inputs.push({
      inputName: "",
      inputType: "pesticide",
      quantity: 0,
      unit: "litres",
      costPerUnit: 0,
      totalCost: 0,
    });
  }

  removeInput(index: number): void {
    this.activityForm.inputs.splice(index, 1);
  }

  calculateActivityInputTotal(input: any): void {
    input.totalCost = (input.quantity || 0) * (input.costPerUnit || 0);
  }

  saveActivity(): void {
    if (!this.cycle) return;
    const data = {
      ...this.activityForm,
      cropCycleId: this.cycle._id,
      farmId: this.cycle.farmId,
      plotId: this.cycle.plotId,
    };
    this.cropActivitiesService.create(data).subscribe({
      next: () => {
        this.showActivityForm = false;
        this.loadActivities(this.cycle!._id);
      },
    });
  }

  openCompleteForm(activity: CropActivity): void {
    this.selectedActivity = activity;
    this.activityForm = {
      ...activity,
      completedDate: new Date().toISOString().split("T")[0],
    };
    this.showCompleteForm = true;
  }

  completeActivity(): void {
    if (!this.selectedActivity) return;
    this.cropActivitiesService
      .complete(this.selectedActivity._id, this.activityForm)
      .subscribe({
        next: () => {
          this.showCompleteForm = false;
          this.selectedActivity = null;
          this.loadActivities(this.cycle!._id);
        },
      });
  }

  deleteActivity(activity: CropActivity): void {
    if (!confirm("Delete this activity?")) return;
    this.cropActivitiesService.delete(activity._id).subscribe({
      next: () => this.loadActivities(this.cycle!._id),
    });
  }

  // ── Cycle actions ──
  updateStatus(status: string): void {
    if (!this.cycle) return;
    this.cropCyclesService.update(this.cycle._id, { status } as any).subscribe({
      next: (c: any) => (this.cycle = c),
    });
  }

  deleteCycle(): void {
    if (!this.cycle || !confirm("Delete this crop cycle?")) return;
    this.cropCyclesService
      .delete(this.cycle._id)
      .subscribe(() => this.goBack());
  }
}
