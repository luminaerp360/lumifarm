import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';

// Farm Management System
import { FarmsModule } from './modules/farms/farms.module';
import { PlotsModule } from './modules/plots/plots.module';
import { CropCyclesModule } from './modules/crop-cycles/crop-cycles.module';
import { FarmWorkersModule } from './modules/farm-workers/farm-workers.module';
import { CropIssuesModule } from './modules/crop-issues/crop-issues.module';
import { FarmFinanceModule } from './modules/farm-finance/farm-finance.module';
import { CropActivitiesModule } from './modules/crop-activities/crop-activities.module';

import { ReportsModule } from './modules/reports/reports.module';
import { TenantPortalModule } from './modules/tenant-portal/tenant-portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    TenantsModule,
    
    // Farm Management System
    FarmsModule,
    PlotsModule, 
    CropCyclesModule,
    FarmWorkersModule,
    CropIssuesModule,
    FarmFinanceModule,
    CropActivitiesModule,
    
    ReportsModule,
    TenantPortalModule,
  ],
})
export class AppModule {}
