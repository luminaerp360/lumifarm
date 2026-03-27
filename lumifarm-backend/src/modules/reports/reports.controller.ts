import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.reportsService.getDashboardStats(tenantId);
  }

  @Get('revenue')
  getRevenue(@Req() req, @Query('year') year?: number) {
    const tenantId = req.user?.tenantId || '';
    const reportYear = year || new Date().getFullYear();
    return this.reportsService.getRevenueReport(tenantId, reportYear);
  }

  @Get('occupancy')
  getOccupancy(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.reportsService.getOccupancyReport(tenantId);
  }

  @Get('lease-expiry')
  getLeaseExpiry(@Req() req, @Query('days') days?: number) {
    const tenantId = req.user?.tenantId || '';
    return this.reportsService.getLeaseExpiryReport(tenantId, days);
  }

  @Get('damages')
  getDamages(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.reportsService.getDamagesReport(tenantId);
  }
}
