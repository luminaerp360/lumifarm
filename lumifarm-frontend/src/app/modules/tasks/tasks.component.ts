import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../../shared/services/theme/theme.service";
import { TasksService } from "../../shared/services/tasks/tasks.service";
import { AuthService } from "../../shared/services/auth/auth.service";
import { FarmWorkersService } from "../../shared/services/farm-workers/farm-workers.service";
import { FarmsService } from "../../shared/services/farms/farms.service";
import { CropCyclesService } from "../../shared/services/crop-cycles/crop-cycles.service";
import { UnitsService } from "../../shared/services/units/units.service";
import { Task } from "../../shared/interfaces/models";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.scss"],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  search = "";
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  // Filters
  filterStatus = "";
  filterPriority = "";
  filterCategory = "";

  // Stats
  stats: any = {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    upcoming: 0,
  };

  // Dropdown data
  farmWorkers: any[] = [];
  farms: any[] = [];
  cropCycles: any[] = [];
  plots: any[] = [];

  // Form
  showForm = false;
  editingTask: Task | null = null;
  saving = false;

  form: any = {
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category: "general",
    dueDate: "",
    startDate: "",
    assignedToId: "",
    assignedToName: "",
    farmId: "",
    farmName: "",
    plotId: "",
    plotName: "",
    cropCycleId: "",
    cropCycleName: "",
    estimatedCost: 0,
    actualCost: 0,
    estimatedHours: 0,
    actualHours: 0,
    notes: "",
    tags: "",
  };

  // Detail view
  selectedTask: Task | null = null;
  showDetail = false;

  statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  categoryOptions = [
    { value: "soil_preparation", label: "Soil Preparation" },
    { value: "planting", label: "Planting" },
    { value: "weeding", label: "Weeding" },
    { value: "spraying", label: "Spraying" },
    { value: "fertilizing", label: "Fertilizing" },
    { value: "irrigation", label: "Irrigation" },
    { value: "harvesting", label: "Harvesting" },
    { value: "equipment_maintenance", label: "Equipment Maintenance" },
    { value: "fencing", label: "Fencing" },
    { value: "general", label: "General" },
    { value: "other", label: "Other" },
  ];

  constructor(
    public themeService: ThemeService,
    private tasksService: TasksService,
    private authService: AuthService,
    private farmWorkersService: FarmWorkersService,
    private farmsService: FarmsService,
    private cropCyclesService: CropCyclesService,
    private unitsService: UnitsService,
  ) {}

  ngOnInit() {
    this.loadTasks();
    this.loadStats();
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.farmWorkersService.getAll(1, 100).subscribe({
      next: (res: any) => (this.farmWorkers = res.data || []),
    });
    this.farmsService.getAll(1, 100).subscribe({
      next: (res: any) => (this.farms = res.data || []),
    });
    this.cropCyclesService.getAll(1, 100).subscribe({
      next: (res: any) => (this.cropCycles = res.data || []),
    });
    this.unitsService.getAll(1, 100).subscribe({
      next: (res: any) => (this.plots = res.data || []),
    });
  }

  loadTasks() {
    this.loading = true;
    this.tasksService
      .getAll(
        this.page,
        this.limit,
        this.search || undefined,
        this.filterStatus || undefined,
        this.filterPriority || undefined,
        this.filterCategory || undefined,
      )
      .subscribe({
        next: (res: any) => {
          this.tasks = res.data || res;
          this.total = res.total || this.tasks.length;
          this.totalPages =
            res.totalPages || Math.ceil(this.total / this.limit);
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  loadStats() {
    this.tasksService.getStats().subscribe({
      next: (res: any) => (this.stats = res),
      error: () => {},
    });
  }

  onSearch() {
    this.page = 1;
    this.loadTasks();
  }

  onFilterChange() {
    this.page = 1;
    this.loadTasks();
  }

  clearFilters() {
    this.search = "";
    this.filterStatus = "";
    this.filterPriority = "";
    this.filterCategory = "";
    this.page = 1;
    this.loadTasks();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadTasks();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadTasks();
    }
  }

  openAddForm() {
    this.editingTask = null;
    this.form = {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      category: "general",
      dueDate: "",
      startDate: "",
      assignedToId: "",
      assignedToName: "",
      farmId: "",
      farmName: "",
      plotId: "",
      plotName: "",
      cropCycleId: "",
      cropCycleName: "",
      estimatedCost: 0,
      actualCost: 0,
      estimatedHours: 0,
      actualHours: 0,
      notes: "",
      tags: "",
    };
    this.showForm = true;
  }

  openEditForm(task: any) {
    this.editingTask = task;
    this.form = {
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      category: task.category || "general",
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
      startDate: task.startDate ? task.startDate.substring(0, 10) : "",
      assignedToId: task.assignedToId || "",
      assignedToName: task.assignedToName || "",
      farmId: task.farmId || "",
      farmName: task.farmName || "",
      plotId: task.plotId || "",
      plotName: task.plotName || "",
      cropCycleId: task.cropCycleId || "",
      cropCycleName: task.cropCycleName || "",
      estimatedCost: task.estimatedCost || 0,
      actualCost: task.actualCost || 0,
      estimatedHours: task.estimatedHours || 0,
      actualHours: task.actualHours || 0,
      notes: task.notes || "",
      tags: (task.tags || []).join(", "),
    };
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingTask = null;
  }

  save() {
    if (!this.form.title.trim()) return;
    this.saving = true;

    const payload: any = {
      ...this.form,
      tags: this.form.tags
        ? this.form.tags
            .split(",")
            .map((t: string) => t.trim())
            .filter((t: string) => t)
        : [],
    };
    if (!payload.dueDate) delete payload.dueDate;
    if (!payload.startDate) delete payload.startDate;

    const obs = this.editingTask
      ? this.tasksService.update(this.editingTask._id, payload)
      : this.tasksService.create(payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.closeForm();
        this.loadTasks();
        this.loadStats();
      },
      error: () => (this.saving = false),
    });
  }

  onWorkerChange(): void {
    const w = this.farmWorkers.find(
      (w: any) => w._id === this.form.assignedToId,
    );
    this.form.assignedToName = w ? w.fullName : "";
  }

  onFarmChange(): void {
    const f = this.farms.find((f: any) => f._id === this.form.farmId);
    this.form.farmName = f ? f.name : "";
    this.form.plotId = "";
    this.form.plotName = "";
  }

  onPlotChange(): void {
    const p = this.plots.find((p: any) => p._id === this.form.plotId);
    this.form.plotName = p ? p.name : "";
  }

  onCropCycleChange(): void {
    const c = this.cropCycles.find((c: any) => c._id === this.form.cropCycleId);
    this.form.cropCycleName = c
      ? c.cropType || c.seasonName || c.propertyName || ""
      : "";
  }

  get filteredPlots(): any[] {
    if (!this.form.farmId) return this.plots;
    return this.plots.filter(
      (p: any) =>
        p.propertyId === this.form.farmId || p.farmId === this.form.farmId,
    );
  }

  completeTask(task: any, event: Event) {
    event.stopPropagation();
    this.tasksService.complete(task._id).subscribe({
      next: () => {
        this.loadTasks();
        this.loadStats();
      },
    });
  }

  cancelTask(task: any, event: Event) {
    event.stopPropagation();
    this.tasksService.cancel(task._id).subscribe({
      next: () => {
        this.loadTasks();
        this.loadStats();
      },
    });
  }

  deleteTask(task: any, event: Event) {
    event.stopPropagation();
    if (!confirm("Delete this task?")) return;
    this.tasksService.delete(task._id).subscribe({
      next: () => {
        this.loadTasks();
        this.loadStats();
        if (this.selectedTask && this.selectedTask._id === task._id) {
          this.showDetail = false;
          this.selectedTask = null;
        }
      },
    });
  }

  startTask(task: any, event: Event) {
    event.stopPropagation();
    this.tasksService.update(task._id, { status: "in_progress" }).subscribe({
      next: () => {
        this.loadTasks();
        this.loadStats();
      },
    });
  }

  reopenTask(task: any, event: Event) {
    event.stopPropagation();
    this.tasksService.update(task._id, { status: "todo" }).subscribe({
      next: () => {
        this.loadTasks();
        this.loadStats();
      },
    });
  }

  viewTask(task: any) {
    this.selectedTask = task;
    this.showDetail = true;
  }

  closeDetail() {
    this.showDetail = false;
    this.selectedTask = null;
  }

  // Helpers
  getStatusLabel(status: string): string {
    return this.statusOptions.find((s) => s.value === status)?.label || status;
  }

  getPriorityLabel(priority: string): string {
    return (
      this.priorityOptions.find((p) => p.value === priority)?.label || priority
    );
  }

  getCategoryLabel(category: string): string {
    return (
      this.categoryOptions.find((c) => c.value === category)?.label || category
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "low":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      case "medium":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "high":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "urgent":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case "low":
        return "fas fa-arrow-down";
      case "medium":
        return "fas fa-minus";
      case "high":
        return "fas fa-arrow-up";
      case "urgent":
        return "fas fa-exclamation-triangle";
      default:
        return "fas fa-minus";
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case "soil_preparation":
        return "fas fa-mountain";
      case "planting":
        return "fas fa-seedling";
      case "weeding":
        return "fas fa-leaf";
      case "spraying":
        return "fas fa-spray-can";
      case "fertilizing":
        return "fas fa-flask";
      case "irrigation":
        return "fas fa-tint";
      case "harvesting":
        return "fas fa-warehouse";
      case "equipment_maintenance":
        return "fas fa-wrench";
      case "fencing":
        return "fas fa-border-all";
      case "general":
        return "fas fa-tasks";
      default:
        return "fas fa-clipboard";
    }
  }

  isOverdue(task: any): boolean {
    if (!task.dueDate) return false;
    if (task.status === "completed" || task.status === "cancelled")
      return false;
    return new Date(task.dueDate) < new Date();
  }

  formatDate(date: string): string {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  getDaysUntilDue(task: any): string {
    if (!task.dueDate) return "";
    const diff = Math.ceil(
      (new Date(task.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return "Due today";
    if (diff === 1) return "Due tomorrow";
    return `${diff}d left`;
  }
}
