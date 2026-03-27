import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FarmsService } from '../../../shared/services/farms/farms.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Property } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-farm-detail',
  templateUrl: './farm-detail.component.html',
  styleUrls: ['./farm-detail.component.scss'],
})
export class FarmDetailComponent implements OnInit {
  property: Property | null = null;
  loading = true;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private FarmsService: FarmsService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.FarmsService.getById(id).subscribe({
        next: (prop) => { this.property = prop; this.loading = false; },
        error: () => { this.loading = false; this.router.navigate(['/properties']); },
      });
    }
  }

  deleteProperty(): void {
    if (!this.property || !confirm('Are you sure you want to delete this property?')) return;
    this.deleting = true;
    this.FarmsService.delete(this.property._id).subscribe({
      next: () => this.router.navigate(['/properties']),
      error: () => { this.deleting = false; },
    });
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
