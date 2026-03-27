import { Injectable, NotFoundException } from '@nestjs/common';
import { PlotRepository } from './repositories/plot.repository';
import { CreatePlotDto, UpdatePlotDto } from './dto/plot.dto';

@Injectable()
export class PlotsService {
  constructor(private readonly plotRepository: PlotRepository) {}

  async create(dto: CreatePlotDto, tenantId: string) {
    return this.plotRepository.create({ ...dto, tenantId } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, farmId?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (farmId) filter.farmId = farmId;
    if (search) {
      filter.$or = [
        { plotNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cropType: { $regex: search, $options: 'i' } },
      ];
    }

    return this.plotRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const plot = await this.plotRepository.findById(id);
    if (!plot || plot.isDeleted || plot.tenantId !== tenantId) {
      throw new NotFoundException('Plot not found');
    }
    return plot;
  }

  async findByFarm(tenantId: string, farmId: string) {
    return this.plotRepository.findByFarm(tenantId, farmId);
  }

  async update(id: string, tenantId: string, dto: UpdatePlotDto) {
    await this.findById(id, tenantId);
    const plot = await this.plotRepository.update(id, dto as any);
    if (!plot) throw new NotFoundException('Plot not found');
    return plot;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.plotRepository.delete(id);
  }

  async getStats(tenantId: string, farmId: string) {
    const [total, planted, vacant, fallow, maintenance] = await Promise.all([
      this.plotRepository.countByFarm(tenantId, farmId),
      this.plotRepository.countByStatus(tenantId, 'planted'),
      this.plotRepository.countByStatus(tenantId, 'vacant'),
      this.plotRepository.countByStatus(tenantId, 'fallow'),
      this.plotRepository.countByStatus(tenantId, 'maintenance'),
    ]);
    return { total, planted, vacant, fallow, maintenance };
  }
}
