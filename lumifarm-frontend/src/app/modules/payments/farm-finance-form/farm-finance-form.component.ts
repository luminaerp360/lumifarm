import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";

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

  transactionTypes = ["expense", "income"];
  expenseCategories = [
    "seed",
    "fertilizer",
    "pesticides",
    "labor",
    "water",
    "equipment",
    "transport",
    "storage",
    "utilities",
    "maintenance",
    "other",
  ];
  incomeCategories = [
    "crop_sale",
    "livestock_sale",
    "subsidy",
    "grant",
    "other",
  ];
  paymentStatuses = ["pending", "paid", "overdue", "partially_paid"];
  paymentMethods = ["cash", "mobile_money", "bank_transfer", "cheque"];

  form: any = {
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
    if (this.transaction) {
      this.form = { ...this.transaction };
    }
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

    this.loading = true;
    this.error = "";

    const payload = {
      tenantId,
      ...this.form,
      amount: Number(this.form.amount),
      quantitySold: Number(this.form.quantitySold || 0),
    };

    // TODO: Call farm finance service
    this.loading = false;
    this.save.emit(payload);
    this.closeModal();
  }

  closeModal(): void {
    this.form = {
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
    };
    this.error = "";
    this.tenantMissing = false;
    this.close.emit();
  }

  get isEditMode(): boolean {
    return !!this.transaction?._id;
  }

  get themeService(): ThemeService {
    return this.themeServiceRef;
  }

  get categoryOptions(): string[] {
    return this.form.transactionType === "expense"
      ? this.expenseCategories
      : this.incomeCategories;
  }
}
