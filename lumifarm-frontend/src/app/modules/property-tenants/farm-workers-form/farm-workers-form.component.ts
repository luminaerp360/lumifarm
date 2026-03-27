import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
} from "@angular/core";
import { PropertyTenantsService } from "../../../shared/services/property-tenants/property-tenants.service";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";

@Component({
  selector: "app-farm-workers-form",
  templateUrl: "./farm-workers-form.component.html",
  styleUrls: ["./farm-workers-form.component.scss"],
})
export class FarmWorkersFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() worker: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  loading = false;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;

  roleOptions = ["owner", "manager", "worker", "specialist", "contractor"];
  specializationOptions = [
    "general",
    "crop_expert",
    "soil_expert",
    "pest_control",
    "irrigation",
    "equipment_operator",
    "veterinary",
  ];
  availabilityOptions = ["full_time", "part_time", "seasonal"];

  form: any = {
    fullName: "",
    phone: "",
    email: "",
    role: "worker",
    specialization: "general",
    nationalId: "",
    availability: "full_time",
    address: "",
    monthlyWage: 0,
    currency: "KES",
    skills: "",
    healthInsuranceNumber: "",
    farmId: "",
  };

  constructor(
    private workersService: PropertyTenantsService,
    public themeService: ThemeService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Refresh tenant context
    this.tenantRefreshLoading = true;
    this.authService.refreshTenantContext().subscribe({
      next: () => {
        this.tenantRefreshLoading = false;
        const tenantId = this.authService.getActiveTenantId();
        if (!tenantId) {
          this.tenantMissing = true;
          this.error =
            "No organization linked to your account. Please log out and log in again.";
        }
      },
      error: () => {
        this.tenantRefreshLoading = false;
        const tenantId = this.authService.getActiveTenantId();
        if (!tenantId) {
          this.tenantMissing = true;
          this.error =
            "Unable to load organization. Please try logging out and in again.";
        }
      },
    });

    if (this.worker) {
      this.form = { ...this.worker };
    }
  }

  ngOnChanges(): void {
    if (this.worker) {
      this.form = { ...this.worker };
    }
  }

  onSubmit(): void {
    if (!this.form.fullName || !this.form.phone) {
      this.error = "Full name and phone are required";
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
      fullName: this.form.fullName,
      phone: this.form.phone,
      email: this.form.email || "",
      role: this.form.role || "worker",
      specialization: this.form.specialization || "general",
      nationalId: this.form.nationalId || "",
      availability: this.form.availability || "full_time",
      address: this.form.address || "",
      monthlyWage: Number(this.form.monthlyWage || 0),
      currency: this.form.currency || "KES",
      skills: this.form.skills || "",
      healthInsuranceNumber: this.form.healthInsuranceNumber || "",
      farmId: this.form.farmId || "",
      joinDate: this.form.joinDate || new Date(),
      isActive: true,
    };

    const request = this.worker?._id
      ? this.workersService.update(this.worker._id, payload)
      : this.workersService.create(payload);

    request.subscribe({
      next: (savedWorker) => {
        this.loading = false;
        this.save.emit(savedWorker);
        this.closeModal();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || "Failed to save farm worker";
      },
    });
  }

  closeModal(): void {
    this.form = {
      fullName: "",
      phone: "",
      email: "",
      role: "worker",
      specialization: "general",
      nationalId: "",
      availability: "full_time",
      address: "",
      monthlyWage: 0,
      currency: "KES",
      skills: "",
      healthInsuranceNumber: "",
      farmId: "",
    };
    this.error = "";
    this.tenantMissing = false;
    this.close.emit();
  }

  get isEditMode(): boolean {
    return !!this.worker?._id;
  }
}
