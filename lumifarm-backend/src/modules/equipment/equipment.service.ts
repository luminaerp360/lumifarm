import { Injectable, NotFoundException } from "@nestjs/common";
import { EquipmentRepository } from "./repositories/equipment.repository";
import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  AddMaintenanceDto,
} from "./dto/equipment.dto";

@Injectable()
export class EquipmentService {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async create(tenantId: string, dto: CreateEquipmentDto) {
    return this.equipmentRepository.create({
      ...dto,
      tenantId,
      currentValue: dto.currentValue || dto.purchasePrice || 0,
    } as any);
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 20,
    search?: string,
    status?: string,
    category?: string,
  ) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
      ];
    }
    return this.equipmentRepository.findPaginated({
      page,
      limit,
      sortBy: "createdAt" as any,
      sortOrder: "desc",
      filter,
    });
  }

  async findById(tenantId: string, id: string) {
    const equipment = await this.equipmentRepository.findById(id);
    if (!equipment || equipment.isDeleted || equipment.tenantId !== tenantId) {
      throw new NotFoundException("Equipment not found");
    }
    return equipment;
  }

  async update(tenantId: string, id: string, dto: UpdateEquipmentDto) {
    await this.findById(tenantId, id);
    return this.equipmentRepository.update(id, dto as any);
  }

  async remove(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.equipmentRepository.delete(id);
  }

  async addMaintenance(
    tenantId: string,
    id: string,
    dto: AddMaintenanceDto,
  ) {
    const equipment = await this.findById(tenantId, id);
    const history = [
      ...(equipment.maintenanceHistory || []),
      { ...dto, cost: dto.cost || 0 },
    ];
    const totalMaintenanceCost =
      (equipment.totalMaintenanceCost || 0) + (dto.cost || 0);
    return this.equipmentRepository.update(id, {
      maintenanceHistory: history,
      totalMaintenanceCost,
      lastMaintenanceDate: new Date(dto.date),
    } as any);
  }

  async findByFarm(tenantId: string, farmId: string) {
    return this.equipmentRepository.findByFarm(tenantId, farmId);
  }

  async findNeedingMaintenance(tenantId: string) {
    return this.equipmentRepository.findNeedingMaintenance(tenantId);
  }

  async getStats(tenantId: string) {
    const [operational, maintenance, repair, idle, retired, totalValue] =
      await Promise.all([
        this.equipmentRepository.countByStatus(tenantId, "operational"),
        this.equipmentRepository.countByStatus(tenantId, "maintenance"),
        this.equipmentRepository.countByStatus(tenantId, "repair"),
        this.equipmentRepository.countByStatus(tenantId, "idle"),
        this.equipmentRepository.countByStatus(tenantId, "retired"),
        this.equipmentRepository.getTotalValue(tenantId),
      ]);
    return {
      total: operational + maintenance + repair + idle + retired,
      operational,
      maintenance,
      repair,
      idle,
      retired,
      totalValue,
    };
  }
}
