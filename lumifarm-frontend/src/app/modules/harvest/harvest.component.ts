import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../../shared/services/theme/theme.service";
import { CropCyclesService } from "../../shared/services/crop-cycles/crop-cycles.service";
import { CropCycle } from "../../shared/interfaces/models";

@Component({
  selector: "app-harvest",
  templateUrl: "./harvest.component.html",
  styleUrls: ["./harvest.component.scss"],
})
export class HarvestComponent implements OnInit {
  cycles: CropCycle[] = [];
  harvestCycles: CropCycle[] = [];
  loading = true;
  search = "";
  statusFilter = "";
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  showDetail = false;
  selectedCycle: CropCycle | null = null;

  totalProjectedYield = 0;
  totalActualYield = 0;
  totalRevenue = 0;
  totalProfit = 0;
  harvestCount = 0;

  constructor(
    public themeService: ThemeService,
    private cropCyclesService: CropCyclesService,
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
          this.harvestCycles = this.cycles.filter(
            (c) =>
              c.actualYield > 0 ||
              c.actualHarvestDate ||
              c.status === "harvesting" ||
              c.status === "completed",
          );
          this.loading = false;
          this.calcStats();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  calcStats(): void {
    this.harvestCount = this.harvestCycles.length;
    this.totalProjectedYield = this.cycles.reduce(
      (s, c) => s + (c.projectedYield || 0),
      0,
    );
    this.totalActualYield = this.cycles.reduce(
      (s, c) => s + (c.actualYield || 0),
      0,
    );
    this.totalRevenue = this.cycles.reduce(
      (s, c) => s + (c.totalRevenue || c.actualCropValue || 0),
      0,
    );
    this.totalProfit = this.cycles.reduce(
      (s, c) => s + (c.profitOrLoss || 0),
      0,
    );
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

  viewDetail(cycle: CropCycle): void {
    this.selectedCycle = cycle;
    this.showDetail = true;
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedCycle = null;
  }

  getYieldPerformance(cycle: CropCycle): number {
    if (!cycle.projectedYield || cycle.projectedYield === 0) return 0;
    return ((cycle.actualYield || 0) / cycle.projectedYield) * 100;
  }

  getYieldPerformanceClass(cycle: CropCycle): string {
    const perf = this.getYieldPerformance(cycle);
    if (perf >= 90) return "text-green-600 dark:text-green-400";
    if (perf >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      planning:
        "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400",
      active:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      harvested:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      abandoned: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[status] || "";
  }

  getQualityClasses(quality: string): string {
    const map: Record<string, string> = {
      excellent:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      good: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      fair: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      poor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return map[quality?.toLowerCase()] || "";
  }
}
