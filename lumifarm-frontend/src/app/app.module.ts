import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

// Auth
import { LoginComponent } from './modules/auth/login/login.component';

// Dashboard
import { DashboardComponent } from './modules/dashboard/dashboard.component';

// Properties
import { PropertiesListComponent } from './modules/properties/properties-list/properties-list.component';
import { PropertyDetailComponent } from './modules/properties/property-detail/property-detail.component';
import { PropertyFormComponent } from './modules/properties/property-form/property-form.component';

// Units
import { UnitsListComponent } from './modules/units/units-list/units-list.component';
import { UnitDetailComponent } from './modules/units/unit-detail/unit-detail.component';
import { UnitsFormComponent } from './modules/units/units-form/units-form.component';

// Property Tenants
import { TenantsListComponent } from './modules/property-tenants/tenants-list/tenants-list.component';
import { TenantDetailComponent } from './modules/property-tenants/tenant-detail/tenant-detail.component';

// Leases
import { LeasesListComponent } from './modules/leases/leases-list/leases-list.component';
import { LeaseDetailComponent } from './modules/leases/lease-detail/lease-detail.component';

// Payments
import { PaymentsListComponent } from './modules/payments/payments-list/payments-list.component';
import { PaymentDetailComponent } from './modules/payments/payment-detail/payment-detail.component';

// Damages
import { DamagesListComponent } from './modules/damages/damages-list/damages-list.component';
import { DamageDetailComponent } from './modules/damages/damage-detail/damage-detail.component';

// Reports
import { ReportsComponent } from './modules/reports/reports.component';

// Users
import { UsersListComponent } from './modules/users/users-list/users-list.component';

// Settings
import { SettingsComponent } from './modules/settings/settings.component';

// System Tenants
import { SystemTenantsComponent } from './modules/system-tenants/system-tenants.component';

// Shared
import { ColorPickerComponent } from './shared/components/color-picker/color-picker.component';

// Interceptor
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    PropertiesListComponent,
    PropertyDetailComponent,
    PropertyFormComponent,
    UnitsListComponent,
    UnitDetailComponent,
    UnitsFormComponent,
    TenantsListComponent,
    TenantDetailComponent,
    LeasesListComponent,
    LeaseDetailComponent,
    PaymentsListComponent,
    PaymentDetailComponent,
    DamagesListComponent,
    DamageDetailComponent,
    ReportsComponent,
    UsersListComponent,
    SettingsComponent,
    SystemTenantsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
