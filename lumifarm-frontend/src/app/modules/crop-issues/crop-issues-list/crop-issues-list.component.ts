import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CropIssuesService } from '../../../shared/services/crop-issues/crop-issues.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Damage, DamageStatus, DamageSeverity } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-crop-issues-list',
  templateUrl: './crop-issues-list.component.html',
  styleUrls: ['./crop-issues-list.component.scss'],
})
export class CropIssuesListComponent implements OnInit {
  damages: Damage[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  severityFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  statuses: DamageStatus[] = ['reported', 'assessed', 'in_repair', 'repaired', 'deducted', 'closed'];
  severities: DamageSeverity[] = ['low', 'medium', 'high', 'critical'];

  constructor(
    private CropIssuesService: CropIssuesService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.loadDamages(); }

  loadDamages(): void {
    this.loading = true;
    this.CropIssuesService.getAll(this.page, this.limit, this.search || undefined, this.statusFilter || undefined, this.severityFilter || undefined).subscribe({
      next: (res) => { this.damages = res.data; this.total = res.total; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void { this.page = 1; this.loadDamages(); }
  onFilterChange(): void { this.page = 1; this.loadDamages(); }
  goToPage(p: number): void { this.page = p; this.loadDamages(); }
  viewDamage(id: string): void { this.router.navigate(['/damages', id]); }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      reported: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      assessed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      in_repair: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      repaired: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      deducted: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      closed: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
    };
    return map[status] || '';
  }

  getSeverityClasses(severity: string): string {
    const map: Record<string, string> = {
      low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    return map[severity] || '';
  }
}
