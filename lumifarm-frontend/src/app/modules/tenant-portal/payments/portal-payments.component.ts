import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TenantPortalService } from '../shared/services/tenant-portal.service';
import { TenantPortalAuthService } from '../shared/services/tenant-portal-auth.service';
import { PortalLease, PortalPayment, MpesaStkResponse } from '../shared/interfaces/portal.interfaces';

@Component({
  selector: 'app-portal-payments',
  templateUrl: './portal-payments.component.html',
  styleUrls: ['./portal-payments.component.scss'],
})
export class PortalPaymentsComponent implements OnInit {
  lease: PortalLease | null = null;
  form: FormGroup;
  loading = false;
  leaseLoading = true;
  error = '';
  successMessage = '';
  stkResponse: MpesaStkResponse | null = null;
  pollingInterval: any = null;
  paymentStatus: PortalPayment | null = null;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  currentMonth = this.months[new Date().getMonth()] + ' ' + new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private portalService: TenantPortalService,
    private auth: TenantPortalAuthService,
  ) {
    this.form = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(0|254|\+254)[17]\d{8}$/)]],
      amount: ['', [Validators.required, Validators.min(1)]],
      paymentPeriod: [this.currentMonth, Validators.required],
      notes: [''],
    });
  }

  ngOnInit() {
    const profile = this.auth.getProfile();
    if (profile?.phone) {
      this.form.patchValue({ phoneNumber: profile.phone });
    }

    this.portalService.getLease().subscribe({
      next: (lease) => {
        this.lease = lease;
        this.form.patchValue({ amount: lease.rentAmount });
        this.leaseLoading = false;
      },
      error: () => (this.leaseLoading = false),
    });
  }

  submit() {
    if (this.form.invalid || !this.lease) return;
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.stkResponse = null;
    this.paymentStatus = null;

    const { phoneNumber, amount, paymentPeriod, notes } = this.form.value;

    this.portalService
      .initiateMpesaPayment({
        phoneNumber,
        amount: Number(amount),
        leaseId: this.lease._id,
        paymentPeriod,
        notes,
      })
      .subscribe({
        next: (res) => {
          this.stkResponse = res;
          this.successMessage = res.message;
          this.loading = false;
          this.startPolling(res.paymentId);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Payment initiation failed. Please try again.';
          this.loading = false;
        },
      });
  }

  startPolling(paymentId: string) {
    let attempts = 0;
    this.pollingInterval = setInterval(() => {
      attempts++;
      this.portalService.getPaymentStatus(paymentId).subscribe({
        next: (payment) => {
          this.paymentStatus = payment;
          if (payment.status === 'completed' || payment.status === 'failed' || attempts >= 12) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
          }
        },
        error: () => {
          if (attempts >= 12) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
          }
        },
      });
    }, 5000); // poll every 5 seconds
  }

  reset() {
    this.stkResponse = null;
    this.successMessage = '';
    this.error = '';
    this.paymentStatus = null;
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  ngOnDestroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }
}
