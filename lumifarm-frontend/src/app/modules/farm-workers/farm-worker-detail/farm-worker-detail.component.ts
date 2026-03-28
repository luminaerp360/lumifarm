import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FarmWorkersService } from "../../../shared/services/farm-workers/farm-workers.service";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";
import { FarmFinanceService } from "../../../shared/services/farm-finance/farm-finance.service";
import { TasksService } from "../../../shared/services/tasks/tasks.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import {
  PropertyTenant,
  Lease,
  FarmFinance,
  Task,
} from "../../../shared/interfaces/models";

@Component({
  selector: "app-farm-worker-detail",
  templateUrl: "./farm-worker-detail.component.html",
  styleUrls: ["./farm-worker-detail.component.scss"],
})
export class FarmWorkerDetailComponent implements OnInit {
  tenant: PropertyTenant | null = null;
  leases: Lease[] = [];
  payments: FarmFinance[] = [];
  workerTasks: Task[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantsService: FarmWorkersService,
    private CropCyclesService: CropCyclesService,
    private FarmFinanceService: FarmFinanceService,
    private tasksService: TasksService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.load(id);
  }

  load(id: string): void {
    this.tenantsService.getById(id).subscribe({
      next: (t) => {
        this.tenant = t;
        this.loading = false;
        this.CropCyclesService.getByTenant(id).subscribe(
          (l) => (this.leases = l),
        );
        this.FarmFinanceService.getAll(1, 100).subscribe(
          (res) => (this.payments = res.data),
        );
        this.tasksService
          .getByWorker(id)
          .subscribe((tasks) => (this.workerTasks = tasks));
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getTaskStatusClasses(status: string): string {
    const map: Record<string, string> = {
      todo: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
      in_progress:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] || "";
  }

  getTaskPriorityClasses(priority: string): string {
    const map: Record<string, string> = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
      medium:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[priority] || "";
  }

  getTaskStatusLabel(status: string): string {
    const map: Record<string, string> = {
      todo: "To Do",
      in_progress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return map[status] || status;
  }

  goBack(): void {
    this.router.navigate(["/tenants"]);
  }

  deleteTenant(): void {
    if (!this.tenant || !confirm("Delete this tenant?")) return;
    this.tenantsService.delete(this.tenant._id).subscribe(() => this.goBack());
  }
}
