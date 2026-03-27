import { Injectable, NotFoundException } from '@nestjs/common';
import { CropActivityRepository } from './repositories/crop-activity.repository';
import { CreateCropActivityDto, UpdateCropActivityDto } from './dto/crop-activity.dto';

@Injectable()
export class CropActivitiesService {
  constructor(private readonly cropActivityRepository: CropActivityRepository) {}

  async create(dto: CreateCropActivityDto, tenantId: string) {
    // Auto-calculate total input cost
    let totalInputCost = 0;
    if (dto.inputs && dto.inputs.length > 0) {
      totalInputCost = dto.inputs.reduce((sum, input) => sum + (input.totalCost || 0), 0);
    }
    const totalActivityCost = totalInputCost + (dto.laborCost || 0);

    return this.cropActivityRepository.create({
      ...dto,
      tenantId,
      totalInputCost,
      totalActivityCost,
    } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, cropCycleId?: string, activityType?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (cropCycleId) filter.cropCycleId = cropCycleId;
    if (activityType) filter.activityType = activityType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { assignedWorkerName: { $regex: search, $options: 'i' } },
      ];
    }

    return this.cropActivityRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const activity = await this.cropActivityRepository.findById(id);
    if (!activity || activity.isDeleted || activity.tenantId !== tenantId) {
      throw new NotFoundException('Crop activity not found');
    }
    return activity;
  }

  async findByCropCycle(tenantId: string, cropCycleId: string) {
    return this.cropActivityRepository.findByCropCycle(tenantId, cropCycleId);
  }

  async findUpcoming(tenantId: string, days?: number) {
    return this.cropActivityRepository.findUpcoming(tenantId, days);
  }

  async findOverdue(tenantId: string) {
    return this.cropActivityRepository.findOverdue(tenantId);
  }

  async update(id: string, tenantId: string, dto: UpdateCropActivityDto) {
    await this.findById(id, tenantId);

    // Recalculate costs if inputs or labor changed
    if (dto.inputs || dto.laborCost !== undefined) {
      const existing = await this.findById(id, tenantId);
      const inputs = dto.inputs || (existing as any).inputs || [];
      const totalInputCost = inputs.reduce((sum: number, input: any) => sum + (input.totalCost || 0), 0);
      const laborCost = dto.laborCost !== undefined ? dto.laborCost : (existing as any).laborCost || 0;
      dto.totalInputCost = totalInputCost;
      dto.totalActivityCost = totalInputCost + laborCost;
    }

    const activity = await this.cropActivityRepository.update(id, dto as any);
    if (!activity) throw new NotFoundException('Crop activity not found');
    return activity;
  }

  async complete(id: string, tenantId: string, dto: UpdateCropActivityDto) {
    dto.status = 'completed' as any;
    dto.completedDate = dto.completedDate || new Date();
    return this.update(id, tenantId, dto);
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.cropActivityRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, scheduled, inProgress, completed, skipped, overdue] = await Promise.all([
      this.cropActivityRepository.countByTenant(tenantId),
      this.cropActivityRepository.countByStatus(tenantId, 'scheduled'),
      this.cropActivityRepository.countByStatus(tenantId, 'in_progress'),
      this.cropActivityRepository.countByStatus(tenantId, 'completed'),
      this.cropActivityRepository.countByStatus(tenantId, 'skipped'),
      this.cropActivityRepository.findOverdue(tenantId).then((r) => r.length),
    ]);
    return { total, scheduled, inProgress, completed, skipped, overdue };
  }

  async getCycleSummary(tenantId: string, cropCycleId: string) {
    const activities = await this.findByCropCycle(tenantId, cropCycleId);
    const totalCost = await this.cropActivityRepository.getTotalCostByCropCycle(tenantId, cropCycleId);
    const completed = activities.filter((a) => a.status === 'completed').length;
    const pending = activities.filter((a) => a.status === 'scheduled' || a.status === 'overdue').length;
    return {
      totalActivities: activities.length,
      completed,
      pending,
      totalCost,
      activities,
    };
  }
}
