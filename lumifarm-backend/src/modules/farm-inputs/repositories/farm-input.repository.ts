import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../database/repositories/base.repository";
import { FarmInput } from "../schemas/farm-input.schema";

@Injectable()
export class FarmInputRepository extends BaseRepository<FarmInput> {
  constructor(
    @InjectModel(FarmInput.name)
    private readonly farmInputModel: Model<FarmInput>,
  ) {
    super(farmInputModel);
  }

  async findByCropCycle(
    tenantId: string,
    cropCycleId: string,
  ): Promise<FarmInput[]> {
    return this.farmInputModel
      .find({ tenantId, cropCycleId, isDeleted: false })
      .sort({ purchaseDate: -1, createdAt: -1 })
      .exec();
  }

  async findByCategory(
    tenantId: string,
    cropCycleId: string,
    category: string,
  ): Promise<FarmInput[]> {
    return this.farmInputModel
      .find({ tenantId, cropCycleId, category, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTotalByCropCycle(
    tenantId: string,
    cropCycleId: string,
  ): Promise<number> {
    const result = await this.farmInputModel.aggregate([
      { $match: { tenantId, cropCycleId, isDeleted: false } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  async getTotalByCategory(
    tenantId: string,
    cropCycleId: string,
  ): Promise<any[]> {
    return this.farmInputModel.aggregate([
      { $match: { tenantId, cropCycleId, isDeleted: false } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getSummaryByCropCycle(
    tenantId: string,
    cropCycleId: string,
  ): Promise<any> {
    const [inputs, totalCost, byCategory] = await Promise.all([
      this.findByCropCycle(tenantId, cropCycleId),
      this.getTotalByCropCycle(tenantId, cropCycleId),
      this.getTotalByCategory(tenantId, cropCycleId),
    ]);

    const paid = inputs.reduce((s, i) => s + (i.amountPaid || 0), 0);

    return {
      totalInputs: inputs.length,
      totalCost,
      totalPaid: paid,
      totalUnpaid: totalCost - paid,
      byCategory,
    };
  }
}
