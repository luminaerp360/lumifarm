import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlotsService, Unit } from '../../../shared/services/plots/plots.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';

@Component({
  selector: 'app-plot-detail',
  templateUrl: './plot-detail.component.html',
  styleUrls: ['./plot-detail.component.scss'],
})
export class PlotDetailComponent implements OnInit {
  unit: Unit | null = null;
  loading = true;
  formModalOpen = false;

  statusOptions = ['vacant', 'occupied', 'maintenance', 'reserved'];

  constructor(
    private PlotsService: PlotsService,
    public themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUnit(id);
    }
  }

  loadUnit(id: string): void {
    this.loading = true;
    this.PlotsService.getById(id).subscribe({
      next: (unit) => {
        this.unit = unit;
        this.loading = false;
      },
      error: (err) => {
        console.error('Load error:', err);
        this.loading = false;
      },
    });
  }

  openEditModal(): void {
    this.formModalOpen = true;
  }

  closeFormModal(): void {
    this.formModalOpen = false;
  }

  onUnitSaved(unit: Unit): void {
    this.unit = unit;
    this.closeFormModal();
  }

  deleteUnit(): void {
    if (!this.unit?._id) return;
    if (confirm('Are you sure you want to delete this unit?')) {
      this.PlotsService.delete(this.unit._id).subscribe({
        next: () => {
          this.router.navigate(['/units']);
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
