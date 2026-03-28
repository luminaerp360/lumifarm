import { Component, OnInit } from "@angular/core";
import { ThemeService } from "../../shared/services/theme/theme.service";
import { EquipmentService } from "../../shared/services/equipment/equipment.service";
import { FarmsService } from "../../shared/services/farms/farms.service";
import { AuthService } from "../../shared/services/auth/auth.service";
import { Equipment } from "../../shared/interfaces/models";

@Component({
  selector: "app-equipment",
  templateUrl: "./equipment.component.html",
  styleUrls: ["./equipment.component.scss"],
})
export class EquipmentComponent implements OnInit {
  items: Equipment[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  categoryFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  categories = ['tractor', 'sprayer', 'plough', 'harrow', 'seeder', 'harvester', 'irrigation_pump', 'water_tank', 'trailer', 'vehicle', 'generator', 'hand_tool', 'power_tool', 'storage', 'other'];
  statuses = ['operational', 'maintenance', 'repair', 'idle', 'retired'];
  conditions = ['excellent', 'good', 'fair', 'poor'];

  showForm = false;
  showDetail = false;
  selectedItem: Equipment | null = null;
  formLoading = false;
  formError = '';

  farms: any[] = [];
  form: any = {};

  stats: any = { total: 0, operational: 0, totalValue: 0 };

  constructor(
    public themeService: ThemeService,
    private equipmentService: EquipmentService,
    private farmsService: FarmsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadDropdowns();
    this.loadStats();
  }

  loadItems(): void {
    this.loading = true;
    this.equipmentService.getAll(this.page, this.limit, this.search || undefined, this.statusFilter || undefined, this.categoryFilter || undefined).subscribe({
      next: (res) => { this.items = res.data; this.total = res.total; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadDropdowns(): void {
    this.farmsService.getAll(1, 100).subscribe({ next: (res) => this.farms = res.data || [] });
  }

  loadStats(): void {
    this.equipmentService.getStats().subscribe({ next: (s) => this.stats = s });
  }

  onSearch(): void { this.page = 1; this.loadItems(); }
  onFilterChange(): void { this.page = 1; this.loadItems(); }
  goToPage(p: number): void { this.page = p; this.loadItems(); }

  openForm(item?: Equipment): void {
    this.selectedItem = item || null;
    this.form = item ? { ...item } : {
      name: '', category: 'tractor', brand: '', modelName: '', serialNumber: '',
      status: 'operational', condition: 'good', farmId: '', farmName: '',
      purchaseDate: '', purchasePrice: 0, currentValue: 0, currency: 'KES',
      fuelType: '', enginePower: '', capacity: '', notes: '',
    };
    this.showForm = true;
    this.showDetail = false;
  }

  closeForm(): void { this.showForm = false; this.selectedItem = null; this.formError = ''; }

  saveItem(): void {
    if (!this.form.name || !this.form.category) { this.formError = 'Name and category are required'; return; }
    const tenantId = this.authService.getActiveTenantId();
    if (!tenantId) { this.formError = 'No organization linked'; return; }
    this.formLoading = true;
    this.formError = '';
    const selectedFarm = this.farms.find((f: any) => f._id === this.form.farmId);
    const payload = {
      tenantId, ...this.form,
      farmName: selectedFarm?.name || this.form.farmName || '',
      purchasePrice: Number(this.form.purchasePrice || 0),
      currentValue: Number(this.form.currentValue || 0),
    };
    const obs = this.selectedItem?._id
      ? this.equipmentService.update(this.selectedItem._id, payload)
      : this.equipmentService.create(payload);
    obs.subscribe({
      next: () => { this.formLoading = false; this.closeForm(); this.loadItems(); this.loadStats(); },
      error: (e) => { this.formLoading = false; this.formError = e?.error?.message || 'Failed to save'; },
    });
  }

  viewDetail(item: Equipment): void {
    this.selectedItem = item;
    this.showDetail = true;
    this.showForm = false;
  }

  closeDetail(): void { this.showDetail = false; this.selectedItem = null; }

  deleteItem(id: string): void {
    if (!confirm('Delete this equipment?')) return;
    this.equipmentService.delete(id).subscribe(() => { this.closeDetail(); this.loadItems(); this.loadStats(); });
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      operational: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      maintenance: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      repair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      idle: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
      retired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[status] || '';
  }

  getConditionClasses(condition: string): string {
    const map: Record<string, string> = {
      excellent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      good: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      fair: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[condition] || '';
  }

  getCategoryIcon(cat: string): string {
    const map: Record<string, string> = {
      tractor: 'fa-tractor', sprayer: 'fa-spray-can', plough: 'fa-mountain', harrow: 'fa-grip-lines',
      seeder: 'fa-seedling', harvester: 'fa-wheat-awn', irrigation_pump: 'fa-faucet', water_tank: 'fa-tint',
      trailer: 'fa-trailer', vehicle: 'fa-truck', generator: 'fa-bolt', hand_tool: 'fa-wrench',
      power_tool: 'fa-tools', storage: 'fa-warehouse', other: 'fa-cog',
    };
    return map[cat] || 'fa-cog';
  }
}
