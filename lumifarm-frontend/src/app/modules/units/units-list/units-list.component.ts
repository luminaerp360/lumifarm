import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UnitsService, Unit, PaginatedResponse } from '../../../shared/services/units/units.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';

@Component({
  selector: 'app-units-list',
  templateUrl: './units-list.component.html',
  styleUrls: ['./units-list.component.scss'],
})
export class UnitsListComponent implements OnInit {
  units: Unit[] = [];
  loading = true;
  search = '';
  propertyId = '';
  statusFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  statusOptions = ['vacant', 'occupied', 'maintenance', 'reserved'];

  // Modal state
  formModalOpen = false;
  selectedUnit: Unit | null = null;

  constructor(
    private unitsService: UnitsService,
    public themeService: ThemeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.propertyId = params['propertyId'] || '';
      this.loadUnits();
    });
  }

  loadUnits(): void {
    this.loading = true;
    this.unitsService
      .getAll(
        this.page,
        this.limit,
        this.propertyId || undefined,
        this.statusFilter || undefined,
        this.search || undefined,
      )
      .subscribe({
        next: (res) => {
          this.units = res.data;
          this.total = res.total;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSearch(): void {
    this.page = 1;
    this.loadUnits();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadUnits();
  }

  goToPage(p: number): void {
    this.page = p;
    this.loadUnits();
  }

  openCreateModal(): void {
    this.selectedUnit = null;
    this.formModalOpen = true;
  }

  openEditModal(unit: Unit): void {
    this.selectedUnit = unit;
    this.formModalOpen = true;
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.selectedUnit = null;
  }

  onUnitSaved(unit: Unit): void {
    this.loadUnits();
    this.closeFormModal();
  }

  viewUnit(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/units', id]);
    }
  }

  deleteUnit(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this unit?')) {
      this.unitsService.delete(id).subscribe({
        next: () => {
          this.loadUnits();
        },
        error: (err) => {
          console.error('Delete error:', err);
        },
      });
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      vacant: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      occupied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      maintenance: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      reserved: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}
