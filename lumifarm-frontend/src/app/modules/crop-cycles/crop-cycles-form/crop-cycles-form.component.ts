import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";

@Component({
  selector: "app-crop-cycles-form",
  templateUrl: "./crop-cycles-form.component.html",
  styleUrls: ["./crop-cycles-form.component.scss"],
})
export class CropCyclesFormComponent implements OnInit {
  @Input() isOpen = false;
  @Input() cropCycle: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  loading = false;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;

  statusOptions = [
    "draft",
    "active",
    "growing",
    "harvesting",
    "completed",
    "abandoned",
  ];
  frequencyOptions = ["monthly", "quarterly", "semi_annually", "annually"];

  form: any = {
    farmId: "",
    plotId: "",
    farmWorkerId: "",
    cropType: "",
    plantingDate: "",
    expectedHarvestDate: "",
    seedSupplier: "",
    seedVariety: "",
    projectedYield: 0,
    expectedCropValue: 0,
    fertilizer: "",
    pesticides: "",
    waterConsumption: 0,
    laborCost: 0,
    harvestFrequency: "annually",
    terms: "",
    currency: "KES",
  };

  constructor(
    private themeServiceRef: ThemeService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.tenantRefreshLoading = true;
    this.authService.refreshTenantContext().subscribe({
      next: () => {
        this.tenantRefreshLoading = false;
        if (!this.authService.getActiveTenantId()) {
          this.tenantMissing = true;
          this.error = "No organization linked to your account.";
        }
      },
      error: () => {
        this.tenantRefreshLoading = false;
        if (!this.authService.getActiveTenantId()) {
          this.tenantMissing = true;
          this.error = "Unable to load organization.";
        }
      },
    });
    if (this.cropCycle) {
      this.form = { ...this.cropCycle };
    }
  }

  onSubmit(): void {
    if (
      !this.form.farmWorkerId ||
      !this.form.cropType ||
      !this.form.plantingDate
    ) {
      this.error = "Farm worker, crop type, and planting date are required";
      return;
    }

    const tenantId = this.authService.getActiveTenantId();
    if (!tenantId) {
      this.error = "No organization linked to your account.";
      this.tenantMissing = true;
      return;
    }

    this.loading = true;
    this.error = "";

    const payload = {
      tenantId,
      ...this.form,
      projectedYield: Number(this.form.projectedYield || 0),
      expectedCropValue: Number(this.form.expectedCropValue || 0),
      waterConsumption: Number(this.form.waterConsumption || 0),
      laborCost: Number(this.form.laborCost || 0),
    };

    // TODO: Call crop cycles service to create/update
    this.loading = false;
    this.save.emit(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.form = {
      farmId: "",
      plotId: "",
      farmWorkerId: "",
      cropType: "",
      plantingDate: "",
      expectedHarvestDate: "",
      seedSupplier: "",
      seedVariety: "",
      projectedYield: 0,
      expectedCropValue: 0,
      fertilizer: "",
      pesticides: "",
      waterConsumption: 0,
      laborCost: 0,
      harvestFrequency: "annually",
      terms: "",
      currency: "KES",
    };
    this.error = "";
    this.tenantMissing = false;
    this.close.emit();
  }

  get isEditMode(): boolean {
    return !!this.cropCycle?._id;
  }

  get themeService(): ThemeService {
    return this.themeServiceRef;
  }
}
