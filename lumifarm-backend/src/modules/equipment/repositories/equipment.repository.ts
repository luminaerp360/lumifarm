import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../database/repositories/base.repository";
import { Equipment } from "../schemas/equipment.schema";

@Injectable()
export class EquipmentRepository extends BaseRepository<Equipment> {
  constructor(@InjectModel(Equipment.name) model: Model<Equipment>) {
    super(model);
  }

  async findByFarm(tenantId: string, farmId: string): Promise<Equipment[]> {
    return this.model
      .find({ tenantId, farmId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(tenantId: string, status: string): Promise<Equipment[]> {
    return this.model
      .find({ tenantId, status, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCategory(
    tenantId: string,
    category: string,
  ): Promise<Equipment[]> {
    return this.model
      .find({ tenantId, category, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findNeedingMaintenance(tenantId: string): Promise<Equipment[]> {
    return this.model
      .find({
        tenantId,
        isDeleted: false,
        nextMaintenanceDate: { $lte: new Date() },
        status: { $ne: "retired" },
      })
      .sort({ nextMaintenanceDate: 1 })
      .exec();
  }

  async countByStatus(tenantId: string, status: string): Promise<number> {
    return this.model.countDocuments({
      tenantId,
      status,
      isDeleted: false,
    });
  }

  async getTotalValue(tenantId: string): Promise<number> {
    const result = await this.model.aggregate([
      {
        $match: {
          tenantId,
          isDeleted: false,
          status: { $ne: "retired" },
        },
      },
      { $group: { _id: null, total: { $sum: "$currentValue" } } },
    ]);
    return result[0]?.total || 0;
  }
}
