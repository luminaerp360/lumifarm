import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { LeaseRepository } from './repositories/lease.repository';
import { CreateLeaseDto, UpdateLeaseDto } from './dto/lease.dto';
import { UnitsService } from '../units/units.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LeasesService {
  constructor(
    private readonly leaseRepository: LeaseRepository,
    private readonly unitsService: UnitsService,
  ) {}

  async create(dto: CreateLeaseDto, tenantId: string) {
    const activeLease = await this.leaseRepository.findActiveByProperty(dto.propertyId);
    if (activeLease) {
      throw new BadRequestException('Property already has an active lease');
    }

    const leaseNumber = `LS-${Date.now().toString(36).toUpperCase()}`;
    return this.leaseRepository.create({
      ...dto,
      tenantId,
      leaseNumber,
      status: 'draft',
    } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { leaseNumber: { $regex: search, $options: 'i' } },
        { propertyName: { $regex: search, $options: 'i' } },
        { propertyTenantName: { $regex: search, $options: 'i' } },
      ];
    }
    return this.leaseRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const lease = await this.leaseRepository.findById(id);
    if (!lease || lease.isDeleted || lease.tenantId !== tenantId) {
      throw new NotFoundException('Lease not found');
    }
    return lease;
  }

  async findByProperty(tenantId: string, propertyId: string) {
    return this.leaseRepository.findByProperty(tenantId, propertyId);
  }

  async findByPropertyTenant(tenantId: string, propertyTenantId: string) {
    return this.leaseRepository.findByPropertyTenant(tenantId, propertyTenantId);
  }

  async findExpiringSoon(tenantId: string, days = 30) {
    return this.leaseRepository.findExpiringSoon(tenantId, days);
  }

  async activate(id: string, tenantId: string) {
    const lease = await this.findById(id, tenantId);

    const activeLease = await this.leaseRepository.findActiveByProperty(lease.propertyId || '');
    if (activeLease && activeLease._id.toString() !== id) {
      throw new BadRequestException('Property already has an active lease');
    }

    const updated = await this.leaseRepository.update(id, { status: 'active' } as any);

    // If lease is for a unit, mark unit as occupied
    if (lease.unitId) {
      try {
        await this.unitsService.assignTenant(lease.unitId, tenantId, lease.propertyTenantId, id);
      } catch (error) {
        // Log error but don't fail the activation
        console.error('Failed to update unit occupancy:', error.message);
      }
    }

    return updated;
  }

  async terminate(id: string, tenantId: string, reason: string) {
    const lease = await this.findById(id, tenantId);

    const updated = await this.leaseRepository.update(id, {
      status: 'terminated',
      terminatedAt: new Date(),
      terminationReason: reason,
    } as any);

    // If lease is for a unit, mark unit as vacant
    if (lease.unitId) {
      try {
        await this.unitsService.releaseTenant(lease.unitId, tenantId);
      } catch (error) {
        // Log error but don't fail the termination
        console.error('Failed to release unit occupancy:', error.message);
      }
    }

    return updated;
  }

  async update(id: string, tenantId: string, dto: UpdateLeaseDto) {
    await this.findById(id, tenantId);
    const lease = await this.leaseRepository.update(id, dto as any);
    if (!lease) throw new NotFoundException('Lease not found');
    return lease;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.leaseRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, active, expired, draft] = await Promise.all([
      this.leaseRepository.countByTenant(tenantId),
      this.leaseRepository.countByStatus(tenantId, 'active'),
      this.leaseRepository.countByStatus(tenantId, 'expired'),
      this.leaseRepository.countByStatus(tenantId, 'draft'),
    ]);
    const expiringSoon = await this.leaseRepository.findExpiringSoon(tenantId, 30);
    return { total, active, expired, draft, expiringSoonCount: expiringSoon.length };
  }
}
