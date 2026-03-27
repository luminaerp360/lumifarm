import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { FarmWorker } from '../schemas/farm-worker.schema';

@Injectable()
export class FarmWorkerRepository extends BaseRepository<FarmWorker> {
  constructor(@InjectModel(FarmWorker.name) model: Model<FarmWorker>) {
    super(model);
  }

  async findByFarm(tenantId: string, farmId: string): Promise<FarmWorker[]> {
    return this.model.find({ tenantId, farmId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByRole(tenantId: string, role: string): Promise<FarmWorker[]> {
    return this.model.find({ tenantId, role, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findActive(tenantId: string): Promise<FarmWorker[]> {
    return this.model.find({ tenantId, isActive: true, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByTenant(tenantId: string): Promise<FarmWorker[]> {
    return this.model.find({ tenantId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async countByFarm(tenantId: string, farmId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, farmId, isDeleted: false });
  }

  async countByTenant(tenantId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, isDeleted: false });
  }

  async countByRole(tenantId: string, role: string): Promise<number> {
    return this.model.countDocuments({ tenantId, role, isDeleted: false });
  }

  async countActive(tenantId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, isActive: true, isDeleted: false });
  }

  async findBySpecialization(tenantId: string, specialization: string): Promise<FarmWorker[]> {
    return this.model
      .find({ tenantId, specialization, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByPhone(tenantId: string, phone: string): Promise<FarmWorker | null> {
    return this.model.findOne({ tenantId, phone, isDeleted: false }).exec();
  }
}
