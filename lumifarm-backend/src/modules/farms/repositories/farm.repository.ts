import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { Farm } from '../schemas/farm.schema';

@Injectable()
export class FarmRepository extends BaseRepository<Farm> {
  constructor(@InjectModel(Farm.name) model: Model<Farm>) {
    super(model);
  }

  async findByTenant(tenantId: string): Promise<Farm[]> {
    return this.model.find({ tenantId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(tenantId: string, status: string): Promise<Farm[]> {
    return this.model.find({ tenantId, status, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByManager(tenantId: string, managerId: string): Promise<Farm[]> {
    return this.model.find({ tenantId, managerId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async countByTenant(tenantId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, isDeleted: false });
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({ tenantId, status, isDeleted: false });
  }

  async findByType(tenantId: string, type: string): Promise<Farm[]> {
    return this.model.find({ tenantId, type, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByLocation(tenantId: string, city: string, county?: string): Promise<Farm[]> {
    const query: any = { tenantId, city, isDeleted: false };
    if (county) query.county = county;
    return this.model.find(query).sort({ createdAt: -1 }).exec();
  }
}
