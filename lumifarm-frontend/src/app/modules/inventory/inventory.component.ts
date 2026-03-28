import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../../shared/services/theme/theme.service";
import { FarmInputsService } from "../../shared/services/farm-inputs/farm-inputs.service";
import { FarmsService } from "../../shared/services/farms/farms.service";
import { CropCyclesService } from "../../shared/services/crop-cycles/crop-cycles.service";
import { UnitsService } from "../../shared/services/units/units.service";
import { AuthService } from "../../shared/services/auth/auth.service";
import { FarmInput } from "../../shared/interfaces/models";

@Component({
  selector: "app-inventory",
  templateUrl: "./inventory.component.html",
  styleUrls: ["./inventory.component.scss"],
})
export class InventoryComponent implements OnInit {
  inputs: FarmInput[] = [];
  loading = true;
  search = '';
  categoryFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  categories = ['seed', 'fertilizer', 'pesticide', 'herbicide', 'fungicide', 'insecticide', 'manure', 'fuel', 'equipment_hire', 'labor', 'transport', 'packaging', 'irrigation', 'land_preparation', 'other'];
  paymentMethods = ['cash', 'mpesa', 'bank_transfer', 'cheque', 'credit', 'mobile_money', 'other'];
  paymentStatuses = ['paid', 'partial', 'pending'];

  showForm = false;
  showDetail = false;
  selectedInput: FarmInput | null = null;
  formLoading = false;
  formError = '';

  farms: any[] = [];
  plots: any[] = [];
  cropCycles: any[] = [];

  form: any = {};

  totalCost = 0;
  totalPaid = 0;
  inputCount = 0;

  constructor(
    public themeService: ThemeService,
    private farmInputsService: FarmInputsService,
    private farmsService: FarmsService,
    private cropCyclesService: CropCyclesService,
    private unitsService: UnitsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadInputs();
    this.loadDropdowns();
  }

  loadInputs(): void {
    this.loading = true;
    this.farmInputsService.getAll(this.page, this.limit, undefined, this.categoryFilter || undefined, this.search || undefined).subscribe({
      next: (res) => {
        this.inputs = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
        this.calcStats();
      },
      error: () => { this.loading = false; },
    });
  }

  loadDropdowns(): void {
    this.farmsService.getAll(1, 100).subscribe({ next: (res) => this.farms = res.data || [] });
    this.cropCyclesService.getAll(1, 100).subscribe({ next: (res) => this.cropCycles = res.data || [] });
  }

  onFarmChange(): void {
    if (this.form.farmId) {
      this.unitsService.getByFarm(this.form.farmId).subscribe({ next: (plots: any[]) => this.plots = plots || [] });
    } else {
      this.plots = [];
      this.form.plotId = '';
    }
  }

  calcStats(): void {
    this.inputCount = this.total;
    this.totalCost = this.inputs.reduce((sum, i) => sum + (i.totalAmount || 0), 0);
    this.totalPaid = this.inputs.reduce((sum, i) => sum + (i.amountPaid || 0), 0);
  }

  onSearch(): void { this.page = 1; this.loadInputs(); }
  onFilterChange(): void { this.page = 1; this.loadInputs(); }
  goToPage(p: number): void { this.page = p; this.loadInputs(); }

  openForm(input?: FarmInput): void {
    this.selectedInput = input || null;
    this.form = input ? { ...input } : {
      name: '', category: 'seed', brand: '', supplier: '', quantity: 0, unit: 'kg',
      unitPrice: 0, totalAmount: 0, currency: 'KES', paymentMethod: 'cash',
      paymentStatus: 'pending', amountPaid: 0, receiptNumber: '', purchaseDate: '',
      applicationDate: '', notes: '', farmId: '', plotId: '', cropCycleId: '',
    };
    if (input?.farmId) this.onFarmChange();
    this.showForm = true;
    this.showDetail = false;
  }

  closeForm(): void { this.showForm = false; this.selectedInput = null; this.formError = ''; }

  calcTotal(): void {
    this.form.totalAmount = (this.form.quantity || 0) * (this.form.unitPrice || 0);
  }

  saveInput(): void {
    if (!this.form.name || !this.form.category) { this.formError = 'Name and category are required'; return; }
    const tenantId = this.authService.getActiveTenantId();
    if (!tenantId) { this.formError = 'No organization linked'; return; }
    this.formLoading = true;
    this.formError = '';
    const payload = { tenantId, ...this.form, quantity: Number(this.form.quantity || 0), unitPrice: Number(this.form.unitPrice || 0), totalAmount: Number(this.form.totalAmount || 0), amountPaid: Number(this.form.amountPaid || 0) };
    const obs = this.selectedInput?._id
      ? this.farmInputsService.update(this.selectedInput._id, payload)
      : this.farmInputsService.create(payload);
    obs.subscribe({
      next: () => { this.formLoading = false; this.closeForm(); this.loadInputs(); },
      error: (e) => { this.formLoading = false; this.formError = e?.error?.message || 'Failed to save'; },
    });
  }

  viewDetail(input: FarmInput): void {
    this.selectedInput = input;
    this.showDetail = true;
    this.showForm = false;
  }

  closeDetail(): void { this.showDetail = false; this.selectedInput = null; }

  deleteInput(id: string): void {
    if (!confirm('Delete this input record?')) return;
    this.farmInputsService.delete(id).subscribe(() => { this.closeDetail(); this.loadInputs(); });
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      seed: 'fa-seedling', fertilizer: 'fa-flask', pesticide: 'fa-spray-can', herbicide: 'fa-spray-can',
      fungicide: 'fa-spray-can', insecticide: 'fa-bug', manure: 'fa-poo', fuel: 'fa-gas-pump',
      equipment_hire: 'fa-tractor', labor: 'fa-users', transport: 'fa-truck', packaging: 'fa-box',
      irrigation: 'fa-tint', land_preparation: 'fa-mountain', other: 'fa-ellipsis-h',
    };
    return map[cat] || 'fa-box';
  }

  getPaymentStatusClasses(status: string): string {
    const map: Record<string, string> = {
      paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      partial: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      pending: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[status] || '';
  }
}
