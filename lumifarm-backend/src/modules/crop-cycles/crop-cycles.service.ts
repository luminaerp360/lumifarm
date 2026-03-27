import { Injectable, NotFoundException } from '@nestjs/common';
import { CropCycleRepository } from './repositories/crop-cycle.repository';
import { CreateCropCycleDto, UpdateCropCycleDto } from './dto/crop-cycle.dto';

@Injectable()
export class CropCyclesService {
  constructor(private readonly cropCycleRepository: CropCycleRepository) {}

  async create(dto: CreateCropCycleDto, tenantId: string) {
    return this.cropCycleRepository.create({ ...dto, tenantId } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, farmId?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (farmId) filter.farmId = farmId;
    if (search) {
      filter.$or = [
        { cropType: { $regex: search, $options: 'i' } },
        { cycleNumber: { $regex: search, $options: 'i' } },
        { seedSupplier: { $regex: search, $options: 'i' } },
      ];
    }

    return this.cropCycleRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const cropCycle = await this.cropCycleRepository.findById(id);
    if (!cropCycle || cropCycle.isDeleted || cropCycle.tenantId !== tenantId) {
      throw new NotFoundException('Crop cycle not found');
    }
    return cropCycle;
  }

  async findByFarm(tenantId: string, farmId: string) {
    return this.cropCycleRepository.findByFarm(tenantId, farmId);
  }

  async findActive(tenantId: string) {
    return this.cropCycleRepository.findActiveCycles(tenantId);
  }

  async update(id: string, tenantId: string, dto: UpdateCropCycleDto) {
    await this.findById(id, tenantId);
    const cropCycle = await this.cropCycleRepository.update(id, dto as any);
    if (!cropCycle) throw new NotFoundException('Crop cycle not found');
    return cropCycle;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.cropCycleRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, active, draft, completed, abandoned] = await Promise.all([
      this.cropCycleRepository.countByTenant(tenantId),
      this.cropCycleRepository.countByStatus(tenantId, 'active'),
      this.cropCycleRepository.countByStatus(tenantId, 'draft'),
      this.cropCycleRepository.countByStatus(tenantId, 'completed'),
      this.cropCycleRepository.countByStatus(tenantId, 'abandoned'),
    ]);
    return { total, active, draft, completed, abandoned };
  }
}
