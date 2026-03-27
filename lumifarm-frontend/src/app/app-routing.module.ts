import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { LoginComponent } from "./modules/auth/login/login.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { FarmsListComponent } from "./modules/farms/farms-list/farms-list.component";
import { FarmDetailComponent } from "./modules/farms/farm-detail/farm-detail.component";
import { FarmFormComponent } from "./modules/farms/farm-form/farm-form.component";
import { PlotsListComponent } from "./modules/plots/plots-list/plots-list.component";
import { PlotDetailComponent } from "./modules/plots/plot-detail/plot-detail.component";
import { FarmWorkersListComponent } from "./modules/farm-workers/farm-workers-list/farm-workers-list.component";
import { FarmWorkerDetailComponent } from "./modules/farm-workers/farm-worker-detail/farm-worker-detail.component";
import { CropCyclesListComponent } from "./modules/crop-cycles/crop-cycles-list/crop-cycles-list.component";
import { CropCycleDetailComponent } from "./modules/crop-cycles/crop-cycle-detail/crop-cycle-detail.component";
import { FarmFinanceListComponent } from "./modules/farm-finance/farm-finance-list/farm-finance-list.component";
import { FarmFinanceDetailComponent } from "./modules/farm-finance/farm-finance-detail/farm-finance-detail.component";
import { CropIssuesListComponent } from "./modules/crop-issues/crop-issues-list/crop-issues-list.component";
import { CropIssueDetailComponent } from "./modules/crop-issues/crop-issue-detail/crop-issue-detail.component";
import { ReportsComponent } from "./modules/reports/reports.component";
import { UsersListComponent } from "./modules/users/users-list/users-list.component";
import { SettingsComponent } from "./modules/settings/settings.component";
import { SystemTenantsComponent } from "./modules/system-tenants/system-tenants.component";
import { TasksComponent } from "./modules/tasks/tasks.component";
import { InventoryComponent } from "./modules/inventory/inventory.component";
import { EquipmentComponent } from "./modules/equipment/equipment.component";
import { HarvestComponent } from "./modules/harvest/harvest.component";
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
      { path: "farms", component: FarmsListComponent },
      { path: "farms/new", component: FarmFormComponent },
      { path: "farms/:id", component: FarmDetailComponent },
      { path: "farms/:id/edit", component: FarmFormComponent },
      { path: "plots", component: PlotsListComponent },
      { path: "plots/:id", component: PlotDetailComponent },
      { path: "farm-workers", component: FarmWorkersListComponent },
      { path: "farm-workers/:id", component: FarmWorkerDetailComponent },
      { path: "crop-cycles", component: CropCyclesListComponent },
      { path: "crop-cycles/:id", component: CropCycleDetailComponent },
      { path: "farm-finance", component: FarmFinanceListComponent },
      { path: "farm-finance/:id", component: FarmFinanceDetailComponent },
      { path: "crop-issues", component: CropIssuesListComponent },
      { path: "crop-issues/:id", component: CropIssueDetailComponent },

      // New modules
      { path: "tasks", component: TasksComponent },
      { path: "inventory", component: InventoryComponent },
      { path: "equipment", component: EquipmentComponent },
      { path: "harvest", component: HarvestComponent },

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
