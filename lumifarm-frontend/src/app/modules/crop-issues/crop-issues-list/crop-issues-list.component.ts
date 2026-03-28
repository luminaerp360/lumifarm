import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CropIssuesService } from '../../../shared/services/crop-issues/crop-issues.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { CropIssue, IssueStatus, IssueSeverity } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-crop-issues-list',
  templateUrl: './crop-issues-list.component.html',
  styleUrls: ['./crop-issues-list.component.scss'],
})
export class CropIssuesListComponent implements OnInit {
  issues: CropIssue[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  severityFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  showForm = false;
  selectedIssue: CropIssue | null = null;
  statuses: IssueStatus[] = ['reported', 'in_treatment', 'resolved', 'closed'];
  severities: IssueSeverity[] = ['low', 'medium', 'high', 'critical'];

  constructor(
    private cropIssuesService: CropIssuesService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.loadIssues(); }

  loadIssues(): void {
    this.loading = true;
    this.cropIssuesService.getAll(this.page, this.limit, this.search || undefined, this.statusFilter || undefined, this.severityFilter || undefined).subscribe({
      next: (res) => { this.issues = res.data; this.total = res.total; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void { this.page = 1; this.loadIssues(); }
  onFilterChange(): void { this.page = 1; this.loadIssues(); }
  goToPage(p: number): void { this.page = p; this.loadIssues(); }
  viewIssue(id: string): void { this.router.navigate(['/crop-issues', id]); }

  openForm(issue?: CropIssue): void {
    this.selectedIssue = issue || null;
    this.showForm = true;
  }

  onFormClose(): void { this.showForm = false; this.selectedIssue = null; }

  onFormSave(payload: any): void {
    const obs = this.selectedIssue?._id
      ? this.cropIssuesService.update(this.selectedIssue._id, payload)
      : this.cropIssuesService.create(payload);
    obs.subscribe({ next: () => { this.showForm = false; this.selectedIssue = null; this.loadIssues(); } });
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      reported: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      in_treatment: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      resolved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
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
