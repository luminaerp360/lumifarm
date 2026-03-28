import { Injectable, NotFoundException } from "@nestjs/common";
import { FarmInputRepository } from "./repositories/farm-input.repository";
import { CreateFarmInputDto, UpdateFarmInputDto } from "./dto/farm-input.dto";

@Injectable()
export class FarmInputsService {
  constructor(private readonly farmInputRepository: FarmInputRepository) {}

  async create(tenantId: string, dto: CreateFarmInputDto) {
    const data: any = { ...dto, tenantId };
    // Auto-calculate totalAmount if not provided
    if (!data.totalAmount && data.quantity && data.unitPrice) {
      data.totalAmount = data.quantity * data.unitPrice;
    }
    if (data.paymentStatus === "paid" && !data.amountPaid) {
      data.amountPaid = data.totalAmount;
    }
    return this.farmInputRepository.create(data);
  }

  async findByCropCycle(tenantId: string, cropCycleId: string) {
    return this.farmInputRepository.findByCropCycle(tenantId, cropCycleId);
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 20,
    cropCycleId?: string,
    category?: string,
    search?: string,
  ) {
    const filter: any = { tenantId };
    if (cropCycleId) filter.cropCycleId = cropCycleId;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { supplier: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }
    return this.farmInputRepository.findPaginated({
      page,
      limit,
      sortBy: "createdAt" as any,
      sortOrder: "desc",
      filter,
    });
  }

  async findById(tenantId: string, id: string) {
    const input = await this.farmInputRepository.findById(id);
    if (!input || input.tenantId !== tenantId) {
      throw new NotFoundException("Farm input not found");
    }
    return input;
  }

  async update(tenantId: string, id: string, dto: UpdateFarmInputDto) {
    await this.findById(tenantId, id);
    const data: any = { ...dto };
    if (data.quantity !== undefined && data.unitPrice !== undefined) {
      data.totalAmount = data.quantity * data.unitPrice;
    }
    return this.farmInputRepository.update(id, data);
  }

  async remove(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.farmInputRepository.delete(id);
  }

  async getSummary(tenantId: string, cropCycleId: string) {
    return this.farmInputRepository.getSummaryByCropCycle(
      tenantId,
      cropCycleId,
    );
  }
}
