import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CropIssuesService } from '../../../shared/services/crop-issues/crop-issues.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { CropIssue } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-crop-issue-detail',
  templateUrl: './crop-issue-detail.component.html',
  styleUrls: ['./crop-issue-detail.component.scss'],
})
export class CropIssueDetailComponent implements OnInit {
  issue: CropIssue | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cropIssuesService: CropIssuesService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  load(id: string): void {
    this.cropIssuesService.getById(id).subscribe({
      next: (d) => { this.issue = d; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  goBack(): void { this.router.navigate(['/crop-issues']); }

  deleteIssue(): void {
    if (!this.issue || !confirm('Delete this crop issue?')) return;
    this.cropIssuesService.delete(this.issue._id).subscribe(() => this.goBack());
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
