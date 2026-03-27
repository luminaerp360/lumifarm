import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { CropActivity } from '../schemas/crop-activity.schema';

@Injectable()
export class CropActivityRepository extends BaseRepository<CropActivity> {
  constructor(@InjectModel(CropActivity.name) model: Model<CropActivity>) {
    super(model);
  }

  async findByCropCycle(tenantId: string, cropCycleId: string): Promise<CropActivity[]> {
    return this.model
      .find({ tenantId, cropCycleId, isDeleted: false })
      .sort({ scheduledDate: 1 })
      .exec();
  }

  async findByFarm(tenantId: string, farmId: string): Promise<CropActivity[]> {
    return this.model
      .find({ tenantId, farmId, isDeleted: false })
      .sort({ scheduledDate: 1 })
      .exec();
  }

  async findUpcoming(tenantId: string, days: number = 7): Promise<CropActivity[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return this.model
      .find({
        tenantId,
        scheduledDate: { $gte: now, $lte: future },
        status: { $in: ['scheduled', 'overdue'] },
        isDeleted: false,
      })
      .sort({ scheduledDate: 1 })
      .exec();
  }

  async findOverdue(tenantId: string): Promise<CropActivity[]> {
    const now = new Date();
    return this.model
      .find({
        tenantId,
        scheduledDate: { $lt: now },
        status: { $in: ['scheduled'] },
        isDeleted: false,
      })
      .sort({ scheduledDate: 1 })
      .exec();
  }

  async findByStatus(tenantId: string, status: string): Promise<CropActivity[]> {
    return this.model
      .find({ tenantId, status, isDeleted: false })
      .sort({ scheduledDate: 1 })
      .exec();
  }

  async countByCropCycle(tenantId: string, cropCycleId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, cropCycleId, isDeleted: false });
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({ tenantId, status, isDeleted: false });
  }

  async countByTenant(tenantId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, isDeleted: false });
  }

  async getTotalCostByCropCycle(tenantId: string, cropCycleId: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { tenantId, cropCycleId, isDeleted: false, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalActivityCost' } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }
}
