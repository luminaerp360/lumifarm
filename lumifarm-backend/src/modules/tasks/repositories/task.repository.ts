import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../database/repositories/base.repository';
import { Task } from '../schemas/task.schema';

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<Task>) {
    super(taskModel);
  }

  async findByFarm(
    tenantId: string,
    farmId: string,
  ): Promise<Task[]> {
    return this.taskModel.find({ tenantId, farmId, isDeleted: false }).sort({ dueDate: 1 }).exec();
  }

  async findByWorker(
    tenantId: string,
    assignedToId: string,
  ): Promise<Task[]> {
    return this.taskModel.find({ tenantId, assignedToId, isDeleted: false }).sort({ dueDate: 1 }).exec();
  }

  async findByCropCycle(
    tenantId: string,
    cropCycleId: string,
  ): Promise<Task[]> {
    return this.taskModel.find({ tenantId, cropCycleId, isDeleted: false }).sort({ dueDate: 1 }).exec();
  }

  async findUpcoming(
    tenantId: string,
    days: number = 7,
  ): Promise<Task[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);
    return this.taskModel
      .find({
        tenantId,
        isDeleted: false,
        status: { $in: ['todo', 'in_progress'] },
        dueDate: { $gte: now, $lte: future },
      })
      .sort({ dueDate: 1 })
      .exec();
  }

  async findOverdue(tenantId: string): Promise<Task[]> {
    const now = new Date();
    return this.taskModel
      .find({
        tenantId,
        isDeleted: false,
        status: { $in: ['todo', 'in_progress'] },
        dueDate: { $lt: now },
      })
      .sort({ dueDate: 1 })
      .exec();
  }

  async countByStatus(tenantId: string): Promise<any> {
    return this.taskModel.aggregate([
      { $match: { tenantId, isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }

  async countByPriority(tenantId: string): Promise<any> {
    return this.taskModel.aggregate([
      { $match: { tenantId, isDeleted: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
  }

  async countByCategory(tenantId: string): Promise<any> {
    return this.taskModel.aggregate([
      { $match: { tenantId, isDeleted: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
  }

  async getTotalCost(tenantId: string): Promise<number> {
    const result = await this.taskModel.aggregate([
      { $match: { tenantId, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$actualCost' } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }
}
