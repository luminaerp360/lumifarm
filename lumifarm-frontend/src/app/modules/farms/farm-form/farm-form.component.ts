import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from "@angular/core";
import { FarmsService } from '../../../shared/services/farms/farms.service';
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { Property } from "../../../shared/interfaces/models";

@Component({
  selector: 'app-farm-form',
  templateUrl: './farm-form.component.html',
  styleUrls: ['./farm-form.component.scss'],
})
export class FarmFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() property: Property | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Property>();

  loading = false;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;

  form: any = {
    name: "",
    description: "",
    type: "mixed_farming",
    status: "under_cultivation",
    address: "",
    city: "",
    county: "",
    totalAcreage: 0,
    soilType: "loamy",
    irrationType: "rainwater",
    dominantCrops: [],
    currency: "KES",
    managerId: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    latitude: 0,
    longitude: 0,
  };

  typeOptions = [
    "vegetable_farm",
    "dairy_farm",
    "grain_farm",
    "coffee_farm",
    "orchard",
    "poultry_farm",
    "mixed_farming",
    "aquaculture",
    "greenhouse",
  ];
  statusOptions = ["under_cultivation", "fallow", "maintenance", "inactive"];
  soilTypeOptions = ["sandy", "clayey", "loamy", "silty", "peat"];
  irrigationTypeOptions = [
    "drip",
    "sprinkler",
    "flood",
    "rainwater",
    "well",
    "none",
  ];
  newCrop = "";

  constructor(
    private FarmsService: FarmsService,
    public themeService: ThemeService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Refresh tenant context from backend and wait for it
    this.tenantRefreshLoading = true;
    this.authService.refreshTenantContext().subscribe({
      next: () => {
        this.tenantRefreshLoading = false;
        // Check if we have a valid tenant ID after refresh
        const tenantId = this.authService.getActiveTenantId();
        if (!tenantId) {
          this.tenantMissing = true;
          this.error =
            "No organization linked to your account. Please log out and log in again.";
        }
      },
      error: (err) => {
        this.tenantRefreshLoading = false;
        // If refresh fails, check if we have a cached tenant ID
        const tenantId = this.authService.getActiveTenantId();
        if (!tenantId) {
          this.tenantMissing = true;
          this.error =
            "Unable to load organization. Please try logging out and in again.";
        }
      },
    });

    if (this.property) {
      this.form = { ...this.property };
    }
  }

  ngOnChanges(): void {
    if (this.property) {
      this.form = { ...this.property };
    } else if (!this.isOpen) {
      this.resetForm();
    }
  }

  addCrop(): void {
    if (this.newCrop.trim()) {
      if (!this.form.dominantCrops) this.form.dominantCrops = [];
      this.form.dominantCrops.push(this.newCrop.trim());
      this.newCrop = "";
    }
  }

  removeCrop(i: number): void {
    this.form.dominantCrops?.splice(i, 1);
  }

  onSubmit(): void {
    if (!this.form.name) {
      this.error = "Farm name is required";
      return;
    }

    if (!this.form.address) {
      this.error = "Farm address is required";
      return;
    }

    if (!this.form.totalAcreage || Number(this.form.totalAcreage) <= 0) {
      this.error = "Total acreage must be greater than 0";
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
      name: this.form.name,
      description: this.form.description || "",
      type: this.form.type,
      status: this.form.status,
      address: this.form.address,
      city: this.form.city || "",
      county: this.form.county || "",
      totalAcreage: Number(this.form.totalAcreage),
      soilType: this.form.soilType,
      irrationType: this.form.irrationType,
      dominantCrops: this.form.dominantCrops || [],
      currency: this.form.currency || "KES",
      managerId: this.form.managerId || "",
      ownerName: this.form.ownerName || "",
      ownerPhone: this.form.ownerPhone || "",
      ownerEmail: this.form.ownerEmail || "",
      latitude: Number(this.form.latitude || 0),
      longitude: Number(this.form.longitude || 0),
    };

    const request = this.property?._id
      ? this.FarmsService.update(this.property._id, payload)
      : this.FarmsService.create(payload);

    request.subscribe({
      next: (savedProperty) => {
        this.loading = false;
        this.save.emit(savedProperty);
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Failed to save farm";
      },
    });
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
    this.form = {
      name: "",
      description: "",
      type: "mixed_farming",
      status: "under_cultivation",
      address: "",
      city: "",
      county: "",
      totalAcreage: 0,
      soilType: "loamy",
      irrationType: "rainwater",
      dominantCrops: [],
      currency: "KES",
      managerId: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
      latitude: 0,
      longitude: 0,
    };
    this.error = "";
    this.newCrop = "";
  }

  get isEditMode(): boolean {
    return !!this.property?._id;
  }
}
