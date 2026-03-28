import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FarmWorkersService } from "../../../shared/services/farm-workers/farm-workers.service";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";
import { FarmFinanceService } from "../../../shared/services/farm-finance/farm-finance.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import {
  PropertyTenant,
  Lease,
  FarmFinance,
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
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tenantsService: FarmWorkersService,
    private CropCyclesService: CropCyclesService,
    private FarmFinanceService: FarmFinanceService,
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
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/tenants"]);
  }

  deleteTenant(): void {
    if (!this.tenant || !confirm("Delete this tenant?")) return;
    this.tenantsService.delete(this.tenant._id).subscribe(() => this.goBack());
  }
}
