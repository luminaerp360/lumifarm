import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { CropIssue } from '../schemas/crop-issue.schema';

@Injectable()
export class CropIssueRepository extends BaseRepository<CropIssue> {
  constructor(@InjectModel(CropIssue.name) model: Model<CropIssue>) {
    super(model);
  }

  async findByFarm(tenantId: string, farmId: string): Promise<CropIssue[]> {
    return this.model.find({ tenantId, farmId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByPlot(tenantId: string, plotId: string): Promise<CropIssue[]> {
    return this.model.find({ tenantId, plotId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(tenantId: string, status: string): Promise<CropIssue[]> {
    return this.model.find({ tenantId, status, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findBySeverity(tenantId: string, severity: string): Promise<CropIssue[]> {
    return this.model.find({ tenantId, severity, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findByIssueType(tenantId: string, issueType: string): Promise<CropIssue[]> {
    return this.model.find({ tenantId, issueType, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async findUnresolved(tenantId: string): Promise<CropIssue[]> {
    return this.model
      .find({
        tenantId,
        status: { $in: ['reported', 'in_treatment'] },
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({ tenantId, status, isDeleted: false });
  }

  async findByCropCycle(tenantId: string, cropCycleId: string): Promise<CropIssue[]> {
    return this.model
      .find({ tenantId, cropCycleId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findCriticalIssues(tenantId: string): Promise<CropIssue[]> {
    return this.model
      .find({
        tenantId,
        severity: 'critical',
        status: { $in: ['reported', 'in_treatment'] },
        isDeleted: false,
      })
      .sort({ reportedDate: -1 })
      .exec();
  }
}
