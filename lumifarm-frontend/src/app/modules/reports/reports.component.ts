import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../shared/services/reports/reports.service';
import { ThemeService } from '../../shared/services/theme/theme.service';
import { DashboardStats } from '../../shared/interfaces/models';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  stats: DashboardStats | null = null;
  revenue: any = null;
  occupancy: any = null;
  leaseExpiry: any = null;
  damageReport: any = null;
  loading = true;
  selectedYear = new Date().getFullYear();

  constructor(
    private reportsService: ReportsService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void { this.loadReports(); }

  loadReports(): void {
    this.loading = true;
    this.reportsService.getDashboard().subscribe({
      next: (s) => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; },
    });
    this.reportsService.getRevenue(this.selectedYear).subscribe((r) => (this.revenue = r));
    this.reportsService.getOccupancy().subscribe((o) => (this.occupancy = o));
    this.reportsService.getLeaseExpiry().subscribe((l) => (this.leaseExpiry = l));
    this.reportsService.getDamages().subscribe((d) => (this.damageReport = d));
  }

  loadRevenue(): void {
    this.reportsService.getRevenue(this.selectedYear).subscribe((r) => (this.revenue = r));
  }
}
