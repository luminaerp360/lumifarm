import { Injectable, NotFoundException } from '@nestjs/common';
import { FarmFinanceRepository } from './repositories/farm-finance.repository';
import { CreateFarmFinanceDto, UpdateFarmFinanceDto } from './dto/farm-finance.dto';

@Injectable()
export class FarmFinanceService {
  constructor(private readonly farmFinanceRepository: FarmFinanceRepository) {}

  async create(dto: CreateFarmFinanceDto, tenantId: string, recordedBy?: string) {
    return this.farmFinanceRepository.create({
      ...dto,
      tenantId,
      recordedBy: recordedBy || '',
      transactionDate: dto.transactionDate || new Date(),
    } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, transactionType?: string, category?: string) {
    const filter: any = { tenantId };
    if (transactionType) filter.transactionType = transactionType;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { vendor: { $regex: search, $options: 'i' } },
        { buyer: { $regex: search, $options: 'i' } },
      ];
    }

    return this.farmFinanceRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const record = await this.farmFinanceRepository.findById(id);
    if (!record || record.isDeleted || record.tenantId !== tenantId) {
      throw new NotFoundException('Farm finance record not found');
    }
    return record;
  }

  async findByFarm(tenantId: string, farmId: string) {
    return this.farmFinanceRepository.findByFarm(tenantId, farmId);
  }

  async findExpenses(tenantId: string) {
    return this.farmFinanceRepository.findByType(tenantId, 'expense');
  }

  async findIncome(tenantId: string) {
    return this.farmFinanceRepository.findByType(tenantId, 'income');
  }

  async update(id: string, tenantId: string, dto: UpdateFarmFinanceDto) {
    await this.findById(id, tenantId);
    const record = await this.farmFinanceRepository.update(id, dto as any);
    if (!record) throw new NotFoundException('Farm finance record not found');
    return record;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.farmFinanceRepository.delete(id);
  }

  async getFinancialSummary(tenantId: string) {
    const expenses = await this.farmFinanceRepository.getTotalByType(tenantId, 'expense');
    const income = await this.farmFinanceRepository.getTotalByType(tenantId, 'income');
    const profit = income - expenses;

    return {
      totalExpenses: expenses,
      totalIncome: income,
      netProfit: profit,
      profitMargin: income > 0 ? ((profit / income) * 100).toFixed(2) : 0,
    };
  }

  async getPendingPayments(tenantId: string) {
    return this.farmFinanceRepository.findPending(tenantId);
  }

  async getOverduePayments(tenantId: string) {
    return this.farmFinanceRepository.findOverdue(tenantId);
  }
}
