import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from "@angular/core";
import {
  UnitsService,
  Unit,
} from "../../../shared/services/units/units.service";
import { PropertiesService } from "../../../shared/services/properties/properties.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { Property, PaginatedResponse } from "../../../shared/interfaces/models";

@Component({
  selector: "app-units-form",
  templateUrl: "./units-form.component.html",
  styleUrls: ["./units-form.component.scss"],
})
export class UnitsFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() unit: Unit | null = null;
  @Input() farmId = "";
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Unit>();

  loading = false;
  loadingFarms = true;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;
  farms: Property[] = [];
  statusOptions = [
    "vacant",
    "planted",
    "fallow",
    "under_preparation",
    "harvested",
    "maintenance",
  ];

  form: any = {
    farmId: "",
    plotNumber: "",
    description: "",
    status: "vacant",
    areaInAcres: 0,
    cropType: "",
    soilQuality: "",
    costToOperatePerCycle: 0,
    currency: "KES",
  };

  constructor(
    private unitsService: UnitsService,
    private propertiesService: PropertiesService,
    public themeService: ThemeService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Refresh tenant context from backend and load farms
    this.tenantRefreshLoading = true;
    this.authService.refreshTenantContext().subscribe({
      next: () => {
        this.tenantRefreshLoading = false;
        const tenantId = this.authService.getActiveTenantId();
        if (!tenantId) {
          this.tenantMissing = true;
          this.error =
            "No organization linked to your account. Please log out and log in again.";
        } else {
          this.loadFarms();
        }
      },
      error: () => {
        this.tenantRefreshLoading = false;
        const tenantId = this.authService.getActiveTenantId();
        if (!tenantId) {
          this.tenantMissing = true;
          this.error =
            "Unable to load organization. Please try logging out and in again.";
        } else {
          this.loadFarms();
        }
      },
    });

    if (this.unit) {
      this.form = { ...this.unit };
    } else if (this.farmId) {
      this.form.farmId = this.farmId;
    }
  }

  ngOnChanges(): void {
    if (this.unit) {
      this.form = { ...this.unit };
    } else if (this.farmId && !this.form.farmId) {
      this.form.farmId = this.farmId;
    }
  }

  loadFarms(): void {
    this.loadingFarms = true;
    this.propertiesService.getAll(1, 1000).subscribe({
      next: (response: PaginatedResponse<Property>) => {
        this.farms = response.data;
        this.loadingFarms = false;
      },
      error: () => {
        this.loadingFarms = false;
      },
    });
  }

  onSubmit(): void {
    if (
      !this.form.farmId ||
      !this.form.plotNumber ||
      !this.form.areaInAcres ||
      Number(this.form.areaInAcres) <= 0
    ) {
      this.error = "Farm, plot number, and area are required";
      return;
    }

    const tenantId = this.authService.getActiveTenantId();
    if (!tenantId) {
      this.error =
        "No organization linked to your account. Please log out and log in again.";
      this.tenantMissing = true;
      return;
    }

    this.loading = true;
    this.error = "";

    const payload = {
      tenantId: tenantId,
      farmId: this.form.farmId,
      plotNumber: this.form.plotNumber,
      description: this.form.description || "",
      status: this.form.status || "vacant",
      areaInAcres: Number(this.form.areaInAcres),
      cropType: this.form.cropType || "",
      soilQuality: this.form.soilQuality || "",
      costToOperatePerCycle: Number(this.form.costToOperatePerCycle || 0),
      currency: this.form.currency || "KES",
    };

    const request = this.unit?._id
      ? this.unitsService.update(this.unit._id, payload)
      : this.unitsService.create(payload);

    request.subscribe({
      next: (savedUnit) => {
        this.loading = false;
        this.save.emit(savedUnit);
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Failed to save plot";
      },
    });
  }

  closeModal(): void {
    this.form = {
      farmId: this.farmId || "",
      plotNumber: "",
      description: "",
      status: "vacant",
      areaInAcres: 0,
      cropType: "",
      soilQuality: "",
      costToOperatePerCycle: 0,
      currency: "KES",
    };
    this.error = "";
    this.tenantMissing = false;
    this.close.emit();
  }

  get isEditMode(): boolean {
    return !!this.unit?._id;
  }

  getFarmName(): string {
    const farm = this.farms.find((f) => f._id === this.form.farmId);
    return farm ? `${farm.name}` : this.form.farmId || "";
  }
}
