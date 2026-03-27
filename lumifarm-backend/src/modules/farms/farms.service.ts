import { Injectable, NotFoundException } from '@nestjs/common';
import { FarmRepository } from './repositories/farm.repository';
import { CreateFarmDto, UpdateFarmDto } from './dto/farm.dto';

@Injectable()
export class FarmsService {
  constructor(private readonly farmRepository: FarmRepository) {}

  async create(dto: CreateFarmDto, tenantId: string) {
    return this.farmRepository.create({ ...dto, tenantId } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, type?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    return this.farmRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const farm = await this.farmRepository.findById(id);
    if (!farm || farm.isDeleted || farm.tenantId !== tenantId) {
      throw new NotFoundException('Farm not found');
    }
    return farm;
  }

  async update(id: string, tenantId: string, dto: UpdateFarmDto) {
    await this.findById(id, tenantId);
    const farm = await this.farmRepository.update(id, dto as any);
    if (!farm) throw new NotFoundException('Farm not found');
    return farm;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.farmRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, under_cultivation, fallow, maintenance] = await Promise.all([
      this.farmRepository.countByTenant(tenantId),
      this.farmRepository.countByStatus(tenantId, 'under_cultivation'),
      this.farmRepository.countByStatus(tenantId, 'fallow'),
      this.farmRepository.countByStatus(tenantId, 'maintenance'),
    ]);
    return { total, under_cultivation, fallow, maintenance };
  }
}
