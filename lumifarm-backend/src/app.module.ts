import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';

// Farm System Modules (NEW)
import { FarmsModule } from './modules/farms/farms.module';
import { PlotsModule } from './modules/plots/plots.module';
import { CropCyclesModule } from './modules/crop-cycles/crop-cycles.module';
import { FarmWorkersModule } from './modules/farm-workers/farm-workers.module';
import { CropIssuesModule } from './modules/crop-issues/crop-issues.module';
import { FarmFinanceModule } from './modules/farm-finance/farm-finance.module';

// Legacy Property Management Modules (DEPRECATED - to be replaced by farm modules)
import { PropertiesModule } from './modules/properties/properties.module';
import { UnitsModule } from './modules/units/units.module';
import { PropertyTenantsModule } from './modules/property-tenants/property-tenants.module';
import { LeasesModule } from './modules/leases/leases.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DamagesModule } from './modules/damages/damages.module';

import { ReportsModule } from './modules/reports/reports.module';
import { TenantPortalModule } from './modules/tenant-portal/tenant-portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    TenantsModule,
    
    // NEW: Farm Management System
    FarmsModule,
    PlotsModule, 
    CropCyclesModule,
    FarmWorkersModule,
    CropIssuesModule,
    FarmFinanceModule,
    
    // LEGACY: Property Management (kept for backward compatibility)
    PropertiesModule,
    UnitsModule,
    PropertyTenantsModule,
    LeasesModule,
    PaymentsModule,
    DamagesModule,
    
    ReportsModule,
    TenantPortalModule,
  ],
})
export class AppModule {}
