import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentsService } from '../../../shared/services/payments/payments.service';
import { ThemeService } from '../../../shared/services/theme/theme.service';
import { Payment, PaymentStatus, PaymentMethod } from '../../../shared/interfaces/models';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsListComponent implements OnInit {
  payments: Payment[] = [];
  loading = true;
  search = '';
  statusFilter = '';
  methodFilter = '';
  page = 1;
  limit = 20;
  total = 0;
  totalPages = 0;
  statuses: PaymentStatus[] = ['pending', 'completed', 'failed', 'refunded', 'partial'];
  methods: PaymentMethod[] = ['mpesa', 'bank_transfer', 'cash', 'cheque', 'card', 'other'];

  // Record payment form
  showForm = false;
  saving = false;
  form: Partial<Payment> = {};

  constructor(
    private paymentsService: PaymentsService,
    public themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.loadPayments(); }

  loadPayments(): void {
    this.loading = true;
    this.paymentsService.getAll(this.page, this.limit, this.search || undefined, this.statusFilter || undefined, this.methodFilter || undefined).subscribe({
      next: (res) => { this.payments = res.data; this.total = res.total; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onSearch(): void { this.page = 1; this.loadPayments(); }
  onFilterChange(): void { this.page = 1; this.loadPayments(); }
  goToPage(p: number): void { this.page = p; this.loadPayments(); }
  viewPayment(id: string): void { this.router.navigate(['/payments', id]); }

  openForm(): void {
    this.form = { paymentDate: new Date().toISOString().split('T')[0], paymentMethod: 'mpesa', paymentType: 'rent', status: 'pending', currency: 'KES' };
    this.showForm = true;
  }

  save(): void {
    if (!this.form.amount) return;
    this.saving = true;
    this.paymentsService.create(this.form).subscribe({
      next: () => { this.saving = false; this.showForm = false; this.loadPayments(); },
      error: () => { this.saving = false; },
    });
  }

  getStatusClasses(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      refunded: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      partial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    return map[status] || '';
  }
}
