import { Component, OnInit } from '@angular/core';
import { TenantPortalService } from '../shared/services/tenant-portal.service';
import { PortalPayment } from '../shared/interfaces/portal.interfaces';

@Component({
  selector: 'app-portal-invoices',
  templateUrl: './portal-invoices.component.html',
  styleUrls: ['./portal-invoices.component.scss'],
})
export class PortalInvoicesComponent implements OnInit {
  payments: PortalPayment[] = [];
  loading = true;
  error = '';
  selectedPayment: PortalPayment | null = null;

  get completedTotal(): number {
    return this.payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  constructor(private portalService: TenantPortalService) {}

  ngOnInit() {
    this.portalService.getInvoices().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load invoices.';
        this.loading = false;
      },
    });
  }

  viewReceipt(payment: PortalPayment) {
    this.selectedPayment = payment;
  }
}
