import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TaskStatus } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(tenantId: string, dto: CreateTaskDto) {
    return this.taskRepository.create({ ...dto, tenantId } as any);
  }

  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    filters: {
      search?: string;
      status?: string;
      priority?: string;
      category?: string;
      assignedToId?: string;
      farmId?: string;
      cropCycleId?: string;
    } = {},
  ) {
    const filter: any = { tenantId };

    if (filters.status) filter.status = filters.status;
    if (filters.priority) filter.priority = filters.priority;
    if (filters.category) filter.category = filters.category;
    if (filters.assignedToId) filter.assignedToId = filters.assignedToId;
    if (filters.farmId) filter.farmId = filters.farmId;
    if (filters.cropCycleId) filter.cropCycleId = filters.cropCycleId;
    if (filters.search) {
      filter.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { notes: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.taskRepository.findPaginated({ page, limit, sortBy: 'dueDate' as any, sortOrder: 'asc', filter });
  }

  async findById(tenantId: string, id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task || task.tenantId !== tenantId) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async findUpcoming(tenantId: string, days: number = 7) {
    return this.taskRepository.findUpcoming(tenantId, days);
  }

  async findOverdue(tenantId: string) {
    return this.taskRepository.findOverdue(tenantId);
  }

  async findByCropCycle(tenantId: string, cropCycleId: string) {
    return this.taskRepository.findByCropCycle(tenantId, cropCycleId);
  }

  async findByWorker(tenantId: string, workerId: string) {
    return this.taskRepository.findByWorker(tenantId, workerId);
  }

  async update(tenantId: string, id: string, dto: UpdateTaskDto) {
    await this.findById(tenantId, id);
    const updateData: any = { ...dto };
    if (dto.status === TaskStatus.COMPLETED && !dto.completedDate) {
      updateData.completedDate = new Date();
    }
    return this.taskRepository.update(id, updateData);
  }

  async complete(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.taskRepository.update(id, {
      status: TaskStatus.COMPLETED,
      completedDate: new Date(),
    });
  }

  async cancel(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.taskRepository.update(id, { status: TaskStatus.CANCELLED });
  }

  async remove(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.taskRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [byStatus, byPriority, byCategory, totalCost, overdue, upcoming] =
      await Promise.all([
        this.taskRepository.countByStatus(tenantId),
        this.taskRepository.countByPriority(tenantId),
        this.taskRepository.countByCategory(tenantId),
        this.taskRepository.getTotalCost(tenantId),
        this.taskRepository.findOverdue(tenantId),
        this.taskRepository.findUpcoming(tenantId, 7),
      ]);

    const statusMap: any = {};
    byStatus.forEach((s: any) => (statusMap[s._id] = s.count));

    const priorityMap: any = {};
    byPriority.forEach((p: any) => (priorityMap[p._id] = p.count));

    const categoryMap: any = {};
    byCategory.forEach((c: any) => (categoryMap[c._id] = c.count));

    return {
      total:
        (statusMap.todo || 0) +
        (statusMap.in_progress || 0) +
        (statusMap.completed || 0) +
        (statusMap.cancelled || 0),
      todo: statusMap.todo || 0,
      inProgress: statusMap.in_progress || 0,
      completed: statusMap.completed || 0,
      cancelled: statusMap.cancelled || 0,
      overdue: overdue.length,
      upcoming: upcoming.length,
      totalCost,
      byPriority: priorityMap,
      byCategory: categoryMap,
    };
  }
}
