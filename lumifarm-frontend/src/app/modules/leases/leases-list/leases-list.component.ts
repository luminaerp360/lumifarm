import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeasesService } from '../../../shared/services/leases/leases.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Lease, LeaseStatus } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-leases-list',
  templateUrl: './leases-list.component.html',
  styleUrls: ['./leases-list.component.scss'],
})
export class LeasesListComponent implements OnInit {
  leases: Lease[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  statuses: LeaseStatus[] = ['draft', 'active', 'expired', 'terminated', 'renewed'];

  constructor(
    private leasesService: LeasesService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.loadLeases(); }

  loadLeases(): void {
    this.loading = true;
    this.leasesService.getAll(this.page, this.limit, this.search || undefined, this.statusFilter || undefined).subscribe({
      next: (res) => { this.leases = res.data; this.total = res.total; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void { this.page = 1; this.loadLeases(); }
  onFilterChange(): void { this.page = 1; this.loadLeases(); }
  goToPage(p: number): void { this.page = p; this.loadLeases(); }
  viewLease(id: string): void { this.router.navigate(['/leases', id]); }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      terminated: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      renewed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return map[status] || '';
  }
}
