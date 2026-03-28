import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FarmFinanceService } from "../../../shared/services/farm-finance/farm-finance.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import {
  FarmFinance,
  FinancePaymentStatus,
} from "../../../shared/interfaces/models";

@Component({
  selector: "app-farm-finance-detail",
  templateUrl: "./farm-finance-detail.component.html",
  styleUrls: ["./farm-finance-detail.component.scss"],
})
export class FarmFinanceDetailComponent implements OnInit {
  transaction: FarmFinance | null = null;
  loading = true;
  showEditForm = false;

  categoryLabels: Record<string, string> = {
    seed: "Seeds",
    fertilizer: "Fertilizer",
    pesticides: "Pesticides",
    herbicides: "Herbicides",
    fungicides: "Fungicides",
    labor: "Labor",
    water: "Water",
    equipment: "Equipment",
    equipment_hire: "Equipment Hire",
    transport: "Transport",
    storage: "Storage",
    utilities: "Utilities",
    maintenance: "Maintenance",
    fuel: "Fuel",
    packaging: "Packaging",
    irrigation: "Irrigation",
    land_preparation: "Land Preparation",
    veterinary: "Veterinary",
    insurance: "Insurance",
    land_rent: "Land Rent",
    crop_sale: "Crop Sale",
    livestock_sale: "Livestock Sale",
    produce_sale: "Produce Sale",
    subsidy: "Subsidy",
    grant: "Grant",
    contract_farming: "Contract Farming",
    rental_income: "Rental Income",
    other: "Other",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private farmFinanceService: FarmFinanceService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.load(id);
  }

  load(id: string): void {
    this.farmFinanceService.getById(id).subscribe({
      next: (t) => {
        this.transaction = t;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(["/farm-finance"]);
  }

  updateStatus(status: FinancePaymentStatus): void {
    if (!this.transaction) return;
    this.farmFinanceService
      .update(this.transaction._id, { paymentStatus: status })
      .subscribe({
        next: (t) => {
          this.transaction = t;
        },
      });
  }

  deleteTransaction(): void {
    if (!this.transaction || !confirm("Delete this transaction?")) return;
    this.farmFinanceService
      .delete(this.transaction._id)
      .subscribe(() => this.goBack());
  }

  onEditSave(payload: any): void {
    if (!this.transaction) return;
    this.farmFinanceService.update(this.transaction._id, payload).subscribe({
      next: (t) => {
        this.transaction = t;
        this.showEditForm = false;
      },
    });
  }

  getCategoryLabel(category: string): string {
    return this.categoryLabels[category] || category;
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      partially_paid:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return map[status] || "";
  }

  getTypeClasses(type: string): string {
    return type === "income"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  }
}
