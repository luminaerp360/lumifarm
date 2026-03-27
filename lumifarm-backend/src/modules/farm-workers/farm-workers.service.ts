import { Injectable, NotFoundException } from '@nestjs/common';
import { FarmWorkerRepository } from './repositories/farm-worker.repository';
import { CreateFarmWorkerDto, UpdateFarmWorkerDto } from './dto/farm-worker.dto';

@Injectable()
export class FarmWorkersService {
  constructor(private readonly farmWorkerRepository: FarmWorkerRepository) {}

  async create(dto: CreateFarmWorkerDto, tenantId: string) {
    return this.farmWorkerRepository.create({ ...dto, tenantId, isActive: true, joinDate: new Date() } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, role?: string, isActive?: boolean) {
    const filter: any = { tenantId };
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    return this.farmWorkerRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const worker = await this.farmWorkerRepository.findById(id);
    if (!worker || worker.isDeleted || worker.tenantId !== tenantId) {
      throw new NotFoundException('Farm worker not found');
    }
    return worker;
  }

  async findActive(tenantId: string) {
    return this.farmWorkerRepository.findActive(tenantId);
  }

  async update(id: string, tenantId: string, dto: UpdateFarmWorkerDto) {
    await this.findById(id, tenantId);
    const worker = await this.farmWorkerRepository.update(id, dto as any);
    if (!worker) throw new NotFoundException('Farm worker not found');
    return worker;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.farmWorkerRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, active, managers, specialists] = await Promise.all([
      this.farmWorkerRepository.countByTenant(tenantId),
      this.farmWorkerRepository.countActive(tenantId),
      this.farmWorkerRepository.countByRole(tenantId, 'manager'),
      this.farmWorkerRepository.countByRole(tenantId, 'specialist'),
    ]);
    return { total, active, managers, specialists };
  }
}
