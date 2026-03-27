import { Injectable, NotFoundException } from '@nestjs/common';
import { PropertyRepository } from './repositories/property.repository';
import { CreatePropertyDto, UpdatePropertyDto } from './dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async create(dto: CreatePropertyDto, tenantId: string) {
    return this.propertyRepository.create({ ...dto, tenantId } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, type?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { buildingName: { $regex: search, $options: 'i' } },
        { unitNumber: { $regex: search, $options: 'i' } },
      ];
    }

    return this.propertyRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const property = await this.propertyRepository.findById(id);
    if (!property || property.isDeleted || property.tenantId !== tenantId) {
      throw new NotFoundException('Property not found');
    }
    return property;
  }

  async update(id: string, tenantId: string, dto: UpdatePropertyDto) {
    await this.findById(id, tenantId);
    const property = await this.propertyRepository.update(id, dto as any);
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.propertyRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, available, occupied, maintenance] = await Promise.all([
      this.propertyRepository.countByTenant(tenantId),
      this.propertyRepository.countByStatus(tenantId, 'available'),
      this.propertyRepository.countByStatus(tenantId, 'occupied'),
      this.propertyRepository.countByStatus(tenantId, 'maintenance'),
    ]);
    return { total, available, occupied, maintenance };
  }
}
