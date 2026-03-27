import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { CropCycleStatus } from "../../../shared/interfaces/models";

@Component({
  selector: "app-crop-cycles-list",
  templateUrl: "./crop-cycles-list.component.html",
  styleUrls: ["./crop-cycles-list.component.scss"],
})
export class CropCyclesListComponent implements OnInit {
  cycles: any[] = [];
  loading = true;
  search = "";
  statusFilter = "";
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  statuses: CropCycleStatus[] = [
    "draft",
    "active",
    "growing",
    "harvesting",
    "completed",
    "abandoned",
  ];

  showForm = false;
  editCycle: any = null;

  constructor(
    private cropCyclesService: CropCyclesService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCycles();
  }

  loadCycles(): void {
    this.loading = true;
    this.cropCyclesService
      .getAll(
        this.page,
        this.limit,
        this.search || undefined,
        this.statusFilter || undefined,
      )
      .subscribe({
        next: (res) => {
          this.cycles = res.data;
          this.total = res.total;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadCycles();
  }
  onFilterChange(): void {
    this.page = 1;
    this.loadCycles();
  }
  goToPage(p: number): void {
    this.page = p;
    this.loadCycles();
  }

  viewCycle(id: string): void {
    this.router.navigate(["/crop-cycles", id]);
  }

  openForm(cycle?: any): void {
    this.editCycle = cycle || null;
    this.showForm = true;
  }

  onFormSave(payload: any): void {
    if (this.editCycle?._id) {
      this.cropCyclesService.update(this.editCycle._id, payload).subscribe({
        next: () => {
          this.showForm = false;
          this.editCycle = null;
          this.loadCycles();
        },
      });
    } else {
      this.cropCyclesService.create(payload).subscribe({
        next: () => {
          this.showForm = false;
          this.editCycle = null;
          this.loadCycles();
        },
      });
    }
  }

  onFormClose(): void {
    this.showForm = false;
    this.editCycle = null;
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      growing:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      harvesting:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      completed:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      abandoned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] || "";
  }
}
