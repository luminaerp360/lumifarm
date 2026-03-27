import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { FarmFinance } from '../schemas/farm-finance.schema';

@Injectable()
export class FarmFinanceRepository extends BaseRepository<FarmFinance> {
  constructor(@InjectModel(FarmFinance.name) model: Model<FarmFinance>) {
    super(model);
  }

  async findByFarm(tenantId: string, farmId: string): Promise<FarmFinance[]> {
    return this.model.find({ tenantId, farmId, isDeleted: false }).sort({ transactionDate: -1 }).exec();
  }

  async findByType(tenantId: string, transactionType: string): Promise<FarmFinance[]> {
    return this.model
      .find({ tenantId, transactionType, isDeleted: false })
      .sort({ transactionDate: -1 })
      .exec();
  }

  async findByCategory(tenantId: string, category: string): Promise<FarmFinance[]> {
    return this.model
      .find({ tenantId, category, isDeleted: false })
      .sort({ transactionDate: -1 })
      .exec();
  }

  async findByStatus(tenantId: string, paymentStatus: string): Promise<FarmFinance[]> {
    return this.model
      .find({ tenantId, paymentStatus, isDeleted: false })
      .sort({ transactionDate: -1 })
      .exec();
  }

  async findByCropCycle(tenantId: string, cropCycleId: string): Promise<FarmFinance[]> {
    return this.model
      .find({ tenantId, cropCycleId, isDeleted: false })
      .sort({ transactionDate: -1 })
      .exec();
  }

  async getTotalByType(tenantId: string, transactionType: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { tenantId, transactionType, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalByCategory(tenantId: string, category: string): Promise<number> {
    const result = await this.model.aggregate([
      { $match: { tenantId, category, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async findByDateRange(tenantId: string, startDate: Date, endDate: Date): Promise<FarmFinance[]> {
    return this.model
      .find({
        tenantId,
        transactionDate: { $gte: startDate, $lte: endDate },
        isDeleted: false,
      })
      .sort({ transactionDate: -1 })
      .exec();
  }

  async findPending(tenantId: string): Promise<FarmFinance[]> {
    return this.model
      .find({ tenantId, paymentStatus: 'pending', isDeleted: false })
      .sort({ transactionDate: -1 })
      .exec();
  }

  async findOverdue(tenantId: string): Promise<FarmFinance[]> {
    return this.model
      .find({ tenantId, paymentStatus: 'overdue', isDeleted: false })
      .sort({ transactionDate: -1 })
      .exec();
  }
}
