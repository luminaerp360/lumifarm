import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { Plot } from '../schemas/plot.schema';

@Injectable()
export class PlotRepository extends BaseRepository<Plot> {
  constructor(@InjectModel(Plot.name) model: Model<Plot>) {
    super(model);
  }

  async findByFarm(tenantId: string, farmId: string): Promise<Plot[]> {
    return this.model.find({ tenantId, farmId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(tenantId: string, status: string): Promise<Plot[]> {
    return this.model.find({ tenantId, status, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByFarmAndStatus(tenantId: string, farmId: string, status: string): Promise<Plot[]> {
    return this.model
      .find({ tenantId, farmId, status, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async countByFarm(tenantId: string, farmId: string): Promise<number> {
    return this.model.countDocuments({ tenantId, farmId, isDeleted: false });
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({ tenantId, status, isDeleted: false });
  }

  async findByCropCycle(tenantId: string, cropCycleId: string): Promise<Plot[]> {
    return this.model
      .find({ tenantId, currentCropCycleId: cropCycleId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCropType(tenantId: string, farmId: string, cropType: string): Promise<Plot[]> {
    return this.model
      .find({ tenantId, farmId, cropType, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }
}
