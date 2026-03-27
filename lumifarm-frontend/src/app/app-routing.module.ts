import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { LoginComponent } from "./modules/auth/login/login.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { PropertiesListComponent } from "./modules/properties/properties-list/properties-list.component";
import { PropertyDetailComponent } from "./modules/properties/property-detail/property-detail.component";
import { PropertyFormComponent } from "./modules/properties/property-form/property-form.component";
import { UnitsListComponent } from "./modules/units/units-list/units-list.component";
import { UnitDetailComponent } from "./modules/units/unit-detail/unit-detail.component";
import { TenantsListComponent } from "./modules/property-tenants/tenants-list/tenants-list.component";
import { TenantDetailComponent } from "./modules/property-tenants/tenant-detail/tenant-detail.component";
import { LeasesListComponent } from "./modules/leases/leases-list/leases-list.component";
import { LeaseDetailComponent } from "./modules/leases/lease-detail/lease-detail.component";
import { PaymentsListComponent } from "./modules/payments/payments-list/payments-list.component";
import { PaymentDetailComponent } from "./modules/payments/payment-detail/payment-detail.component";
import { DamagesListComponent } from "./modules/damages/damages-list/damages-list.component";
import { DamageDetailComponent } from "./modules/damages/damage-detail/damage-detail.component";
import { ReportsComponent } from "./modules/reports/reports.component";
import { UsersListComponent } from "./modules/users/users-list/users-list.component";
import { SettingsComponent } from "./modules/settings/settings.component";
import { SystemTenantsComponent } from "./modules/system-tenants/system-tenants.component";
import { AuthGuard } from "./shared/guards/auth.guard";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },

      // Farm-first routes
      { path: "farms", component: PropertiesListComponent },
      { path: "farms/new", component: PropertyFormComponent },
      { path: "farms/:id", component: PropertyDetailComponent },
      { path: "farms/:id/edit", component: PropertyFormComponent },
      { path: "plots", component: UnitsListComponent },
      { path: "plots/:id", component: UnitDetailComponent },
      { path: "farm-workers", component: TenantsListComponent },
      { path: "farm-workers/:id", component: TenantDetailComponent },
      { path: "crop-cycles", component: LeasesListComponent },
      { path: "crop-cycles/:id", component: LeaseDetailComponent },
      { path: "farm-finance", component: PaymentsListComponent },
      { path: "farm-finance/:id", component: PaymentDetailComponent },
      { path: "crop-issues", component: DamagesListComponent },
      { path: "crop-issues/:id", component: DamageDetailComponent },

      // Legacy aliases
      { path: "properties", component: PropertiesListComponent },
      { path: "properties/new", component: PropertyFormComponent },
      { path: "properties/:id", component: PropertyDetailComponent },
      { path: "properties/:id/edit", component: PropertyFormComponent },
      { path: "units", component: UnitsListComponent },
      { path: "units/:id", component: UnitDetailComponent },
      { path: "tenants", component: TenantsListComponent },
      { path: "tenants/:id", component: TenantDetailComponent },
      { path: "leases", component: LeasesListComponent },
      { path: "leases/:id", component: LeaseDetailComponent },
      { path: "payments", component: PaymentsListComponent },
      { path: "payments/:id", component: PaymentDetailComponent },
      { path: "damages", component: DamagesListComponent },
      { path: "damages/:id", component: DamageDetailComponent },
      { path: "reports", component: ReportsComponent },
      { path: "users", component: UsersListComponent },
      { path: "settings", component: SettingsComponent },
      { path: "system-tenants", component: SystemTenantsComponent },
    ],
  },
  // Tenant Portal — lazy-loaded, separate auth
  {
    path: "tenant-portal",
    loadChildren: () =>
      import("./modules/tenant-portal/tenant-portal.module").then(
        (m) => m.TenantPortalModule,
      ),
  },
  { path: "**", redirectTo: "dashboard" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
