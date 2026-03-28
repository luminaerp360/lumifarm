import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { FarmsService } from "../../../shared/services/farms/farms.service";
import { UnitsService } from "../../../shared/services/units/units.service";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";

@Component({
  selector: "app-crop-issues-form",
  templateUrl: "./crop-issues-form.component.html",
  styleUrls: ["./crop-issues-form.component.scss"],
})
export class CropIssuesFormComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() issue: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  loading = false;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;

  farms: any[] = [];
  plots: any[] = [];
  cropCycles: any[] = [];

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
    private farmsService: FarmsService,
    private unitsService: UnitsService,
    private cropCyclesService: CropCyclesService,
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
        } else {
          this.loadDropdowns();
        }
      },
    });
    if (this.issue) {
      this.form = { ...this.issue };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["issue"] && this.issue) {
      this.form = { ...this.issue };
      if (this.issue.farmId) this.onFarmChange();
    } else if (changes["issue"] && !this.issue) {
      this.resetForm();
    }
  }

  loadDropdowns(): void {
    this.farmsService.getAll(1, 100).subscribe({
      next: (res) => (this.farms = res.data || []),
    });
    this.cropCyclesService.getAll(1, 100).subscribe({
      next: (res) => (this.cropCycles = res.data || []),
    });
  }

  onFarmChange(): void {
    if (this.form.farmId) {
      this.unitsService.getByFarm(this.form.farmId).subscribe({
        next: (plots: any[]) => (this.plots = plots || []),
      });
    } else {
      this.plots = [];
      this.form.plotId = "";
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

    const selectedFarm = this.farms.find(
      (f: any) => f._id === this.form.farmId,
    );
    const selectedPlot = this.plots.find(
      (p: any) => p._id === this.form.plotId,
    );
    const selectedCycle = this.cropCycles.find(
      (c: any) => c._id === this.form.cropCycleId,
    );

    const payload = {
      tenantId,
      ...this.form,
      farmName: selectedFarm?.name || "",
      plotName: selectedPlot?.unitNumber || selectedPlot?.name || "",
      cropCycleName: selectedCycle?.cropName || selectedCycle?.name || "",
      costToFix: Number(this.form.costToFix || 0),
      reportedDate: this.form.reportedDate || new Date(),
    };

    this.loading = false;
    this.save.emit(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  resetForm(): void {
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
  }

  get isEditMode(): boolean {
    return !!this.issue?._id;
  }

  get themeService(): ThemeService {
    return this.themeServiceRef;
  }
}
