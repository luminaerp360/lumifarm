import { Component, OnInit } from '@angular/core';
import { FarmsService } from '../../../shared/services/farms/farms.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Property, PaginatedResponse } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-farms-list',
  templateUrl: './farms-list.component.html',
  styleUrls: ['./farms-list.component.scss'],
})
export class FarmsListComponent implements OnInit {
  properties: Property[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  typeFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;

  // Modal state
  formModalOpen = false;
  selectedProperty: Property | null = null;

  statusOptions = ['available', 'occupied', 'maintenance', 'unavailable'];
  typeOptions = ['apartment', 'house', 'commercial', 'land', 'bedsitter', 'single_room', 'one_bedroom', 'two_bedroom', 'three_bedroom'];

  constructor(
    private FarmsService: FarmsService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.FarmsService.getAll(this.page, this.limit, this.search || undefined, this.statusFilter || undefined, this.typeFilter || undefined).subscribe({
      next: (res) => {
        this.properties = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadProperties();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadProperties();
  }

  goToPage(p: number): void {
    this.page = p;
    this.loadProperties();
  }

  openCreateModal(): void {
    this.selectedProperty = null;
    this.formModalOpen = true;
  }

  openEditModal(property: Property): void {
    this.selectedProperty = property;
    this.formModalOpen = true;
  }

  closeFormModal(): void {
    this.formModalOpen = false;
    this.selectedProperty = null;
  }

  onPropertySaved(): void {
    this.closeFormModal();
    this.loadProperties();
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      occupied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      maintenance: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      unavailable: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[status] || 'bg-gray-100 text-gray-700';
  }
}
