import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FarmFinanceService } from "../../../shared/services/farm-finance/farm-finance.service";
import { ThemeService } from "../../../shared/services/theme/theme.service";
import {
  FarmFinance,
  FinancialSummary,
} from "../../../shared/interfaces/models";

@Component({
  selector: "app-farm-finance-list",
  templateUrl: "./farm-finance-list.component.html",
  styleUrls: ["./farm-finance-list.component.scss"],
})
export class FarmFinanceListComponent implements OnInit {
  transactions: FarmFinance[] = [];
  loading = true;
  search = "";
  typeFilter = "";
  categoryFilter = "";
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  summary: FinancialSummary = {
    totalExpenses: 0,
    totalIncome: 0,
    netProfit: 0,
    profitMargin: 0,
  };
  pendingCount = 0;
  overdueCount = 0;

  showForm = false;
  editingTransaction: FarmFinance | null = null;

  expenseCategories = [
    { value: "seed", label: "Seeds", icon: "fa-seedling" },
    { value: "fertilizer", label: "Fertilizer", icon: "fa-flask" },
    { value: "pesticides", label: "Pesticides", icon: "fa-bug" },
    { value: "herbicides", label: "Herbicides", icon: "fa-leaf" },
    { value: "fungicides", label: "Fungicides", icon: "fa-shield-virus" },
    { value: "labor", label: "Labor", icon: "fa-users" },
    { value: "water", label: "Water", icon: "fa-tint" },
    { value: "equipment", label: "Equipment", icon: "fa-tools" },
    { value: "equipment_hire", label: "Equipment Hire", icon: "fa-truck" },
    { value: "transport", label: "Transport", icon: "fa-shipping-fast" },
    { value: "storage", label: "Storage", icon: "fa-warehouse" },
    { value: "utilities", label: "Utilities", icon: "fa-bolt" },
    { value: "maintenance", label: "Maintenance", icon: "fa-wrench" },
    { value: "fuel", label: "Fuel", icon: "fa-gas-pump" },
    { value: "packaging", label: "Packaging", icon: "fa-box" },
    { value: "irrigation", label: "Irrigation", icon: "fa-water" },
    {
      value: "land_preparation",
      label: "Land Preparation",
      icon: "fa-mountain",
    },
    { value: "veterinary", label: "Veterinary", icon: "fa-horse" },
    { value: "insurance", label: "Insurance", icon: "fa-shield-alt" },
    { value: "land_rent", label: "Land Rent", icon: "fa-map" },
    { value: "other", label: "Other", icon: "fa-ellipsis-h" },
  ];

  incomeCategories = [
    { value: "crop_sale", label: "Crop Sale", icon: "fa-store" },
    { value: "livestock_sale", label: "Livestock Sale", icon: "fa-horse" },
    { value: "produce_sale", label: "Produce Sale", icon: "fa-carrot" },
    { value: "subsidy", label: "Subsidy", icon: "fa-hand-holding-usd" },
    { value: "grant", label: "Grant", icon: "fa-donate" },
    {
      value: "contract_farming",
      label: "Contract Farming",
      icon: "fa-file-contract",
    },
    { value: "rental_income", label: "Rental Income", icon: "fa-home" },
    { value: "other", label: "Other", icon: "fa-ellipsis-h" },
  ];

  constructor(
    private farmFinanceService: FarmFinanceService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
    this.loadSummary();
  }

  loadTransactions(): void {
    this.loading = true;
    this.farmFinanceService
      .getAll(
        this.page,
        this.limit,
        this.search || undefined,
        this.typeFilter || undefined,
        this.categoryFilter || undefined,
      )
      .subscribe({
        next: (res) => {
          this.transactions = res.data;
          this.total = res.total;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadSummary(): void {
    this.farmFinanceService.getSummary().subscribe({
      next: (s) => {
        this.summary = s;
      },
    });
    this.farmFinanceService.getPendingPayments().subscribe({
      next: (p) => {
        this.pendingCount = p.length;
      },
    });
    this.farmFinanceService.getOverduePayments().subscribe({
      next: (o) => {
        this.overdueCount = o.length;
      },
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadTransactions();
  }
  onFilterChange(): void {
    this.page = 1;
    this.categoryFilter = "";
    this.loadTransactions();
  }
  onCategoryChange(): void {
    this.page = 1;
    this.loadTransactions();
  }
  goToPage(p: number): void {
    this.page = p;
    this.loadTransactions();
  }
  viewTransaction(id: string): void {
    this.router.navigate(["/farm-finance", id]);
  }

  openForm(transaction?: FarmFinance): void {
    this.editingTransaction = transaction || null;
    this.showForm = true;
  }

  onFormSave(payload: any): void {
    const obs = this.editingTransaction
      ? this.farmFinanceService.update(this.editingTransaction._id, payload)
      : this.farmFinanceService.create(payload);
    obs.subscribe({
      next: () => {
        this.showForm = false;
        this.editingTransaction = null;
        this.loadTransactions();
        this.loadSummary();
      },
    });
  }

  onFormClose(): void {
    this.showForm = false;
    this.editingTransaction = null;
  }

  get categoryOptions(): { value: string; label: string; icon: string }[] {
    if (this.typeFilter === "expense") return this.expenseCategories;
    if (this.typeFilter === "income") return this.incomeCategories;
    return [...this.expenseCategories, ...this.incomeCategories];
  }

  getCategoryLabel(category: string): string {
    const all = [...this.expenseCategories, ...this.incomeCategories];
    return all.find((c) => c.value === category)?.label || category;
  }

  getCategoryIcon(category: string): string {
    const all = [...this.expenseCategories, ...this.incomeCategories];
    return all.find((c) => c.value === category)?.icon || "fa-tag";
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
