import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

// Layout
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { HeaderComponent } from "./layout/header/header.component";

// Auth
import { LoginComponent } from "./modules/auth/login/login.component";

// Dashboard
import { DashboardComponent } from "./modules/dashboard/dashboard.component";

// Farms
import { FarmsListComponent } from "./modules/farms/farms-list/farms-list.component";
import { FarmDetailComponent } from "./modules/farms/farm-detail/farm-detail.component";
import { FarmFormComponent } from "./modules/farms/farm-form/farm-form.component";

// Plots
import { PlotsListComponent } from "./modules/plots/plots-list/plots-list.component";
import { PlotDetailComponent } from "./modules/plots/plot-detail/plot-detail.component";
import { PlotsFormComponent } from "./modules/plots/plots-form/plots-form.component";

// Farm Workers
import { FarmWorkersListComponent } from "./modules/farm-workers/farm-workers-list/farm-workers-list.component";
import { FarmWorkerDetailComponent } from "./modules/farm-workers/farm-worker-detail/farm-worker-detail.component";

// Crop Cycles
import { CropCyclesListComponent } from "./modules/crop-cycles/crop-cycles-list/crop-cycles-list.component";
import { CropCycleDetailComponent } from "./modules/crop-cycles/crop-cycle-detail/crop-cycle-detail.component";
import { CropCyclesFormComponent } from "./modules/crop-cycles/crop-cycles-form/crop-cycles-form.component";

// Farm Finance
import { FarmFinanceListComponent } from "./modules/farm-finance/farm-finance-list/farm-finance-list.component";
import { FarmFinanceDetailComponent } from "./modules/farm-finance/farm-finance-detail/farm-finance-detail.component";
import { FarmFinanceFormComponent } from "./modules/farm-finance/farm-finance-form/farm-finance-form.component";

// Crop Issues
import { CropIssuesListComponent } from "./modules/crop-issues/crop-issues-list/crop-issues-list.component";
import { CropIssueDetailComponent } from "./modules/crop-issues/crop-issue-detail/crop-issue-detail.component";
import { CropIssuesFormComponent } from "./modules/crop-issues/crop-issues-form/crop-issues-form.component";

// Farm Workers - Form
import { FarmWorkersFormComponent } from "./modules/farm-workers/farm-workers-form/farm-workers-form.component";

// Reports
import { ReportsComponent } from "./modules/reports/reports.component";

// Users
import { UsersListComponent } from "./modules/users/users-list/users-list.component";

// Settings
import { SettingsComponent } from "./modules/settings/settings.component";

// System Tenants
import { SystemTenantsComponent } from "./modules/system-tenants/system-tenants.component";

// Shared
import { ColorPickerComponent } from "./shared/components/color-picker/color-picker.component";

// Interceptor
import { AuthInterceptor } from "./shared/interceptors/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    SidebarComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    FarmsListComponent,
    FarmDetailComponent,
    FarmFormComponent,
    PlotsListComponent,
    PlotDetailComponent,
    PlotsFormComponent,
    FarmWorkersListComponent,
    FarmWorkerDetailComponent,
    FarmWorkersFormComponent,
    CropCyclesListComponent,
    CropCycleDetailComponent,
    CropCyclesFormComponent,
    FarmFinanceListComponent,
    FarmFinanceDetailComponent,
    FarmFinanceFormComponent,
    CropIssuesListComponent,
    CropIssueDetailComponent,
    CropIssuesFormComponent,
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
