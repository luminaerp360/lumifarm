import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { CropCycle } from '../schemas/crop-cycle.schema';

@Injectable()
export class CropCycleRepository extends BaseRepository<CropCycle> {
  constructor(@InjectModel(CropCycle.name) model: Model<CropCycle>) {
    super(model);
  }

  async findByFarm(tenantId: string, farmId: string): Promise<CropCycle[]> {
    return this.model.find({ tenantId, farmId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByPlot(tenantId: string, plotId: string): Promise<CropCycle[]> {
    return this.model.find({ tenantId, plotId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(tenantId: string, status: string): Promise<CropCycle[]> {
    return this.model.find({ tenantId, status, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByWorker(tenantId: string, farmWorkerId: string): Promise<CropCycle[]> {
    return this.model
      .find({ tenantId, farmWorkerId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findActiveCycles(tenantId: string): Promise<CropCycle[]> {
    return this.model
      .find({ tenantId, status: { $in: ['draft', 'active', 'growing', 'harvesting'] }, isDeleted: false })
      .sort({ plantingDate: -1 })
      .exec();
  }

  async countByFarm(tenantId: string, farmId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, farmId, isDeleted: false });
  }

  async countByTenant(tenantId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, isDeleted: false });
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({ tenantId, status, isDeleted: false });
  }

  async findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<CropCycle[]> {
    return this.model
      .find({
        tenantId,
        plantingDate: { $gte: startDate, $lte: endDate },
        isDeleted: false,
      })
      .sort({ plantingDate: -1 })
      .exec();
  }

  async findByCropType(tenantId: string, cropType: string): Promise<CropCycle[]> {
    return this.model.find({ tenantId, cropType, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }
}
