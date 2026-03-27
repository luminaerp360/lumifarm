import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TenantPortalRoutingModule } from './tenant-portal-routing.module';
import { TenantPortalLayoutComponent } from './layout/tenant-portal-layout.component';
import { PortalLoginComponent } from './auth/portal-login/portal-login.component';
import { SetupPasswordComponent } from './auth/setup-password/setup-password.component';
import { PortalDashboardComponent } from './dashboard/portal-dashboard.component';
import { PortalLeaseComponent } from './lease/portal-lease.component';
import { PortalPaymentsComponent } from './payments/portal-payments.component';
import { PortalInvoicesComponent } from './invoices/portal-invoices.component';
import { TenantPortalAuthInterceptor } from './shared/interceptors/tenant-portal-auth.interceptor';

@NgModule({
  declarations: [
    TenantPortalLayoutComponent,
    PortalLoginComponent,
    SetupPasswordComponent,
    PortalDashboardComponent,
    PortalLeaseComponent,
    PortalPaymentsComponent,
    PortalInvoicesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenantPortalRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TenantPortalAuthInterceptor, multi: true },
  ],
})
export class TenantPortalModule {}
