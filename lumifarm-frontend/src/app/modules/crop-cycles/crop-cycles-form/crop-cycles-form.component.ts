import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { FarmsService } from "../../../shared/services/farms/farms.service";
import { PlotsService } from "../../../shared/services/plots/plots.service";
import { FarmWorkersService } from "../../../shared/services/farm-workers/farm-workers.service";

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

  farms: any[] = [];
  plots: any[] = [];
  workers: any[] = [];

  statusOptions = [
    "draft",
    "active",
    "growing",
    "harvesting",
    "completed",
    "abandoned",
  ];

  soilConditionOptions = ["excellent", "good", "fair", "poor"];
  soilPrepOptions = [
    "ploughing",
    "harrowing",
    "ridging",
    "terracing",
    "raised_beds",
    "no_till",
    "other",
  ];
  weatherOptions = [
    "sunny",
    "cloudy",
    "rainy",
    "foggy",
    "windy",
    "hot",
    "cold",
  ];
  yieldUnitOptions = ["kg", "bags", "tonnes", "crates", "pieces"];
  seedUnitOptions = ["kg", "bags", "pieces", "tubers"];

  form: any = {
    farmId: "",
    plotId: "",
    farmWorkerId: "",
    cropType: "",
    seasonName: "",
    seasonYear: new Date().getFullYear(),
    plantingDate: "",
    expectedHarvestDate: "",
    seedSupplier: "",
    seedVariety: "",
    seedQuantity: 0,
    seedUnit: "kg",
    seedCostPerUnit: 0,
    totalSeedCost: 0,
    soilCondition: "",
    soilPreparationMethod: "",
    weatherAtPlanting: {
      condition: "",
      temperature: null,
      rainfall: null,
      soilMoisture: "",
      notes: "",
    },
    projectedYield: 0,
    yieldUnit: "kg",
    expectedCropValue: 0,
    pricePerUnit: 0,
    fertilizer: "",
    pesticides: "",
    waterConsumption: 0,
    laborCost: 0,
    notes: "",
    currency: "KES",
  };

  constructor(
    private themeServiceRef: ThemeService,
    public authService: AuthService,
    private farmsService: FarmsService,
    private plotsService: PlotsService,
    private farmWorkersService: FarmWorkersService,
  ) {}

  ngOnInit(): void {
    this.tenantRefreshLoading = true;
    this.authService.refreshTenantContext().subscribe({
      next: () => {
        this.tenantRefreshLoading = false;
        if (!this.authService.getActiveTenantId()) {
          this.tenantMissing = true;
          this.error = "No organization linked to your account.";
        } else {
          this.loadDropdowns();
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
      this.form = {
        ...this.form,
        ...this.cropCycle,
        weatherAtPlanting:
          this.cropCycle.weatherAtPlanting || this.form.weatherAtPlanting,
      };
    }
  }

  loadDropdowns(): void {
    this.farmsService.getAll(1, 100).subscribe({
      next: (res) => {
        this.farms = res.data;
      },
    });
    this.plotsService.getAll(1, 100).subscribe({
      next: (res) => {
        this.plots = res.data;
      },
    });
    this.farmWorkersService.getAll(1, 100).subscribe({
      next: (res) => {
        this.workers = res.data;
      },
    });
  }

  onFarmChange(): void {
    this.form.plotId = "";
  }

  get filteredPlots(): any[] {
    if (!this.form.farmId) return this.plots;
    return this.plots.filter(
      (p: any) =>
        p.farmId === this.form.farmId || p.propertyId === this.form.farmId,
    );
  }

  calculateSeedCost(): void {
    this.form.totalSeedCost =
      (this.form.seedQuantity || 0) * (this.form.seedCostPerUnit || 0);
  }

  onSubmit(): void {
    if (!this.form.cropType || !this.form.plantingDate) {
      this.error = "Crop type and planting date are required";
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
      seedQuantity: Number(this.form.seedQuantity || 0),
      seedCostPerUnit: Number(this.form.seedCostPerUnit || 0),
      totalSeedCost: Number(this.form.totalSeedCost || 0),
      pricePerUnit: Number(this.form.pricePerUnit || 0),
      seasonYear: Number(this.form.seasonYear || new Date().getFullYear()),
    };

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
      seasonName: "",
      seasonYear: new Date().getFullYear(),
      plantingDate: "",
      expectedHarvestDate: "",
      seedSupplier: "",
      seedVariety: "",
      seedQuantity: 0,
      seedUnit: "kg",
      seedCostPerUnit: 0,
      totalSeedCost: 0,
      soilCondition: "",
      soilPreparationMethod: "",
      weatherAtPlanting: {
        condition: "",
        temperature: null,
        rainfall: null,
        soilMoisture: "",
        notes: "",
      },
      projectedYield: 0,
      yieldUnit: "kg",
      expectedCropValue: 0,
      pricePerUnit: 0,
      fertilizer: "",
      pesticides: "",
      waterConsumption: 0,
      laborCost: 0,
      notes: "",
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
