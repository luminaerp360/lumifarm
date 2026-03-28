import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import { FarmsService } from "../../../shared/services/farms/farms.service";
import { CropCyclesService } from "../../../shared/services/crop-cycles/crop-cycles.service";
import { Property, CropCycle } from "../../../shared/interfaces/models";

@Component({
  selector: "app-farm-finance-form",
  templateUrl: "./farm-finance-form.component.html",
  styleUrls: ["./farm-finance-form.component.scss"],
})
export class FarmFinanceFormComponent implements OnInit {
  @Input() isOpen = false;
  @Input() transaction: any | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  loading = false;
  error = "";
  tenantRefreshLoading = false;
  tenantMissing = false;

  farms: Property[] = [];
  cropCycles: CropCycle[] = [];

  transactionTypes = ["expense", "income"];

  expenseCategories = [
    { value: "seed", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "pesticides", label: "Pesticides" },
    { value: "herbicides", label: "Herbicides" },
    { value: "fungicides", label: "Fungicides" },
    { value: "labor", label: "Labor" },
    { value: "water", label: "Water" },
    { value: "equipment", label: "Equipment" },
    { value: "equipment_hire", label: "Equipment Hire" },
    { value: "transport", label: "Transport" },
    { value: "storage", label: "Storage" },
    { value: "utilities", label: "Utilities" },
    { value: "maintenance", label: "Maintenance" },
    { value: "fuel", label: "Fuel" },
    { value: "packaging", label: "Packaging" },
    { value: "irrigation", label: "Irrigation" },
    { value: "land_preparation", label: "Land Preparation" },
    { value: "veterinary", label: "Veterinary" },
    { value: "insurance", label: "Insurance" },
    { value: "land_rent", label: "Land Rent" },
    { value: "other", label: "Other" },
  ];

  incomeCategories = [
    { value: "crop_sale", label: "Crop Sale" },
    { value: "livestock_sale", label: "Livestock Sale" },
    { value: "produce_sale", label: "Produce Sale" },
    { value: "subsidy", label: "Subsidy" },
    { value: "grant", label: "Grant" },
    { value: "contract_farming", label: "Contract Farming" },
    { value: "rental_income", label: "Rental Income" },
    { value: "other", label: "Other" },
  ];

  paymentStatuses = ["pending", "paid", "overdue", "partially_paid"];
  paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "mpesa", label: "M-Pesa" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
    { value: "mobile_money", label: "Mobile Money" },
    { value: "on_account", label: "On Account" },
    { value: "other", label: "Other" },
  ];

  form: any = this.getDefaultForm();

  constructor(
    private themeServiceRef: ThemeService,
    public authService: AuthService,
    private farmsService: FarmsService,
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
    if (this.transaction) {
      this.form = {
        ...this.getDefaultForm(),
        ...this.transaction,
        transactionDate: this.transaction.transactionDate
          ? new Date(this.transaction.transactionDate)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0],
      };
    }
  }

  loadDropdowns(): void {
    this.farmsService.getAll(1, 100).subscribe({
      next: (res) => {
        this.farms = res.data;
      },
    });
    this.cropCyclesService.getAll(1, 100).subscribe({
      next: (res) => {
        this.cropCycles = res.data;
      },
    });
  }

  onSubmit(): void {
    if (!this.form.description || !this.form.amount || this.form.amount <= 0) {
      this.error = "Description and amount are required";
      return;
    }

    const tenantId = this.authService.getActiveTenantId();
    if (!tenantId) {
      this.error = "No organization linked to your account.";
      this.tenantMissing = true;
      return;
    }

    this.error = "";

    const payload = {
      tenantId,
      farmId: this.form.farmId || undefined,
      cropCycleId: this.form.cropCycleId || undefined,
      transactionType: this.form.transactionType,
      category: this.form.category,
      description: this.form.description,
      amount: Number(this.form.amount),
      currency: this.form.currency || "KES",
      transactionDate: this.form.transactionDate,
      paymentStatus: this.form.paymentStatus,
      paymentMethod: this.form.paymentMethod || undefined,
      reference: this.form.reference || undefined,
      vendor: this.form.vendor || undefined,
      buyer: this.form.buyer || undefined,
      quantitySold: this.form.quantitySold
        ? Number(this.form.quantitySold)
        : undefined,
      pricePerUnit: this.form.pricePerUnit
        ? Number(this.form.pricePerUnit)
        : undefined,
      notes: this.form.notes || undefined,
    };

    this.save.emit(payload);
  }

  closeModal(): void {
    this.form = this.getDefaultForm();
    this.error = "";
    this.tenantMissing = false;
    this.close.emit();
  }

  getDefaultForm(): any {
    return {
      farmId: "",
      cropCycleId: "",
      transactionType: "expense",
      category: "seed",
      description: "",
      amount: 0,
      currency: "KES",
      transactionDate: new Date().toISOString().split("T")[0],
      paymentStatus: "pending",
      paymentMethod: "",
      reference: "",
      vendor: "",
      buyer: "",
      quantitySold: 0,
      pricePerUnit: 0,
      notes: "",
    };
  }

  get isEditMode(): boolean {
    return !!this.transaction?._id;
  }

  get themeService(): ThemeService {
    return this.themeServiceRef;
  }

  get categoryOptions(): { value: string; label: string }[] {
    return this.form.transactionType === "expense"
      ? this.expenseCategories
      : this.incomeCategories;
  }
}
