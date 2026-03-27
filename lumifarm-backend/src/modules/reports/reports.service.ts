import { Injectable } from '@nestjs/common';
import { PropertyRepository } from '../properties/repositories/property.repository';
import { PropertyTenantRepository } from '../property-tenants/repositories/property-tenant.repository';
import { LeaseRepository } from '../leases/repositories/lease.repository';
import { PaymentRepository } from '../payments/repositories/payment.repository';
import { DamageRepository } from '../damages/repositories/damage.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly propertyRepo: PropertyRepository,
    private readonly propertyTenantRepo: PropertyTenantRepository,
    private readonly leaseRepo: LeaseRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly damageRepo: DamageRepository,
  ) {}

  async getDashboardStats(tenantId: string) {
    const [
      totalProperties,
      availableProperties,
      occupiedProperties,
      totalTenants,
      activeTenants,
      totalLeases,
      activeLeases,
      totalPayments,
      completedPayments,
      pendingPayments,
      totalDamages,
      reportedDamages,
    ] = await Promise.all([
      this.propertyRepo.countByTenant(tenantId),
      this.propertyRepo.countByStatus(tenantId, 'available'),
      this.propertyRepo.countByStatus(tenantId, 'occupied'),
      this.propertyTenantRepo.countBySystemTenant(tenantId),
      this.propertyTenantRepo.countActive(tenantId),
      this.leaseRepo.countByTenant(tenantId),
      this.leaseRepo.countByStatus(tenantId, 'active'),
      this.paymentRepo.countByTenant(tenantId),
      this.paymentRepo.countByStatus(tenantId, 'completed'),
      this.paymentRepo.countByStatus(tenantId, 'pending'),
      this.damageRepo.countByTenant(tenantId),
      this.damageRepo.countByStatus(tenantId, 'reported'),
    ]);

    const now = new Date();
    const monthlyRevenue = await this.paymentRepo.getMonthlyRevenue(tenantId, now.getFullYear(), now.getMonth() + 1);
    const totalRevenue = await this.paymentRepo.getTotalByStatus(tenantId, 'completed');
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
    const expiringSoon = await this.leaseRepo.findExpiringSoon(tenantId, 30);

    return {
      properties: { total: totalProperties, available: availableProperties, occupied: occupiedProperties, occupancyRate },
      tenants: { total: totalTenants, active: activeTenants },
      leases: { total: totalLeases, active: activeLeases, expiringSoonCount: expiringSoon.length },
      payments: { total: totalPayments, completed: completedPayments, pending: pendingPayments },
      revenue: { monthly: monthlyRevenue, total: totalRevenue },
      damages: { total: totalDamages, reported: reportedDamages },
    };
  }

  async getRevenueReport(tenantId: string, year: number) {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      const revenue = await this.paymentRepo.getMonthlyRevenue(tenantId, year, m);
      months.push({ month: m, revenue });
    }
    const totalAnnual = months.reduce((sum, m) => sum + m.revenue, 0);
    return { year, months, totalAnnual };
  }

  async getOccupancyReport(tenantId: string) {
    const properties = await this.propertyRepo.findByTenant(tenantId);
    const total = properties.length;
    const occupied = properties.filter(p => p.status === 'occupied').length;
    const available = properties.filter(p => p.status === 'available').length;
    const maintenance = properties.filter(p => p.status === 'maintenance').length;
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, available, maintenance, occupancyRate: rate };
  }

  async getLeaseExpiryReport(tenantId: string, daysAhead = 90) {
    const expiring = await this.leaseRepo.findExpiringSoon(tenantId, daysAhead);
    return {
      daysAhead,
      count: expiring.length,
      leases: expiring.map(l => ({
        id: l._id,
        leaseNumber: l.leaseNumber,
        propertyName: l.propertyName,
        tenantName: l.propertyTenantName,
        endDate: l.endDate,
        rentAmount: l.rentAmount,
      })),
    };
  }

  async getDamagesReport(tenantId: string) {
    const totalCost = await this.damageRepo.getTotalCost(tenantId);
    const [total, reported, assessed, inRepair, repaired] = await Promise.all([
      this.damageRepo.countByTenant(tenantId),
      this.damageRepo.countByStatus(tenantId, 'reported'),
      this.damageRepo.countByStatus(tenantId, 'assessed'),
      this.damageRepo.countByStatus(tenantId, 'in_repair'),
      this.damageRepo.countByStatus(tenantId, 'repaired'),
    ]);
    return { total, reported, assessed, inRepair, repaired, totalCost };
  }
}
