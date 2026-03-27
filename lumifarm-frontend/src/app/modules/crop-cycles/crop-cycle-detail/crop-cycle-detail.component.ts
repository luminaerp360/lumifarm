import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";
import { CropActivitiesService } from "../../../shared/services/crop-activities/crop-activities.service";
import { FarmFinanceService } from "../../../shared/services/farm-finance/farm-finance.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { CropCycle, CropActivity } from "../../../shared/interfaces/models";

@Component({
  selector: "app-crop-cycle-detail",
  templateUrl: "./crop-cycle-detail.component.html",
  styleUrls: ["./crop-cycle-detail.component.scss"],
})
export class CropCycleDetailComponent implements OnInit {
  cycle: CropCycle | null = null;
  activities: CropActivity[] = [];
  expenses: any[] = [];
  loading = true;
  activeTab: "timeline" | "expenses" | "harvest" = "timeline";

  // Activity form
  showActivityForm = false;
  showCompleteForm = false;
  selectedActivity: CropActivity | null = null;
  activityForm: any = {
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cropCyclesService: CropCyclesService,
    private cropActivitiesService: CropActivitiesService,
    private farmFinanceService: FarmFinanceService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.load(id);
  }

  load(id: string): void {
    this.cropCyclesService.getById(id).subscribe({
      next: (c: any) => {
        this.cycle = c;
        this.loading = false;
        this.loadActivities(id);
        this.loadExpenses(id);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadActivities(cycleId: string): void {
    this.cropActivitiesService.getByCropCycle(cycleId).subscribe({
      next: (acts) => (this.activities = acts),
      error: () => {},
    });
  }

  loadExpenses(cycleId: string): void {
    this.farmFinanceService.getAll(1, 100, "", "", "").subscribe({
      next: (res: any) => {
        this.expenses = (res.data || []).filter(
          (e: any) => e.cropCycleId === cycleId,
        );
      },
      error: () => {},
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

  getActivityIcon(type: string): string {
    const found = this.activityTypes.find((t) => t.value === type);
    return found ? found.icon : "fas fa-tasks";
  }

  getActivityLabel(type: string): string {
    const found = this.activityTypes.find((t) => t.value === type);
    return found ? found.label : type;
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

  // ── Activity CRUD ──
  openActivityForm(): void {
    this.activityForm = {
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

  calculateInputTotal(input: any): void {
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
