import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeasesService } from '../../../shared/services/leases/leases.service';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Lease, Payment } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-lease-detail',
  templateUrl: './lease-detail.component.html',
  styleUrls: ['./lease-detail.component.scss'],
})
export class LeaseDetailComponent implements OnInit {
  lease: Lease | null = null;
  payments: Payment[] = [];
  loading = true;
  showTerminate = false;
  terminationReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leasesService: LeasesService,
    private paymentsService: PaymentsService,
    public themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  load(id: string): void {
    this.leasesService.getById(id).subscribe({
      next: (l) => {
        this.lease = l;
        this.loading = false;
        this.paymentsService.getByLease(id).subscribe((p) => (this.payments = p));
      },
      error: () => { this.loading = false; },
    });
  }

  goBack(): void { this.router.navigate(['/leases']); }

  activate(): void {
    if (!this.lease) return;
    this.leasesService.activate(this.lease._id).subscribe((l) => (this.lease = l));
  }

  terminate(): void {
    if (!this.lease || !this.terminationReason) return;
    this.leasesService.terminate(this.lease._id, this.terminationReason).subscribe((l) => {
      this.lease = l;
      this.showTerminate = false;
    });
  }

  deleteLease(): void {
    if (!this.lease || !confirm('Delete this lease?')) return;
    this.leasesService.delete(this.lease._id).subscribe(() => this.goBack());
  }

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
