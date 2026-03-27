import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { Lease } from '../schemas/lease.schema';

@Injectable()
export class LeaseRepository extends BaseRepository<Lease> {
  constructor(@InjectModel(Lease.name) model: Model<Lease>) {
    super(model);
  }

  async findByTenant(tenantId: string): Promise<Lease[]> {
    return this.model.find({ tenantId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByProperty(tenantId: string, propertyId: string): Promise<Lease[]> {
    return this.model.find({ tenantId, propertyId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByPropertyTenant(tenantId: string, propertyTenantId: string): Promise<Lease[]> {
    return this.model.find({ tenantId, propertyTenantId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findActiveByProperty(propertyId: string): Promise<Lease | null> {
    return this.model.findOne({ propertyId, status: 'active', isDeleted: false }).exec();
  }

  async findExpiringSoon(tenantId: string, daysAhead: number): Promise<Lease[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return this.model.find({
      tenantId,
      status: 'active',
      endDate: { $lte: futureDate },
      isDeleted: false,
    }).sort({ endDate: 1 }).exec();
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({ tenantId, status, isDeleted: false });
  }

  async countByTenant(tenantId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, isDeleted: false });
  }
}
