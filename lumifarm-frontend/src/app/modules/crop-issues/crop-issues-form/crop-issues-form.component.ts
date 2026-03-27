import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";

@Component({
  selector: "app-crop-issues-form",
  templateUrl: "./crop-issues-form.component.html",
  styleUrls: ["./crop-issues-form.component.scss"],
})
export class CropIssuesFormComponent implements OnInit {
  @Input() isOpen = false;
  @Input() issue: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  loading = false;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;

  issueTypes = [
    "pest_infestation",
    "disease",
    "weather_damage",
    "soil_deficiency",
    "water_stress",
    "flood",
    "drought",
    "equipment_failure",
    "labor_shortage",
    "other",
  ];
  severityOptions = ["low", "medium", "high", "critical"];
  statusOptions = ["reported", "in_treatment", "resolved", "closed"];

  form: any = {
    farmId: "",
    plotId: "",
    cropCycleId: "",
    issueType: "pest_infestation",
    severity: "medium",
    status: "reported",
    description: "",
    affectedArea: "",
    diagnosis: "",
    remedialMeasure: "",
    costToFix: 0,
    currency: "KES",
    notes: "",
    pestName: "",
    diseaseName: "",
    chemicalUsed: "",
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
    if (this.issue) {
      this.form = { ...this.issue };
    }
  }

  onSubmit(): void {
    if (!this.form.issueType || !this.form.description) {
      this.error = "Issue type and description are required";
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
      costToFix: Number(this.form.costToFix || 0),
      reportedDate: this.form.reportedDate || new Date(),
    };

    // TODO: Call crop issues service
    this.loading = false;
    this.save.emit(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.form = {
      farmId: "",
      plotId: "",
      cropCycleId: "",
      issueType: "pest_infestation",
      severity: "medium",
      status: "reported",
      description: "",
      affectedArea: "",
      diagnosis: "",
      remedialMeasure: "",
      costToFix: 0,
      currency: "KES",
      notes: "",
      pestName: "",
      diseaseName: "",
      chemicalUsed: "",
    };
    this.error = "";
    this.tenantMissing = false;
    this.close.emit();
  }

  get isEditMode(): boolean {
    return !!this.issue?._id;
  }

  get themeService(): ThemeService {
    return this.themeServiceRef;
  }
}
