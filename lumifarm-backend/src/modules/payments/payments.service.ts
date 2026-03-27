import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(dto: CreatePaymentDto, tenantId: string, recordedBy: string) {
    const receiptNumber = `RCP-${Date.now().toString(36).toUpperCase()}`;
    return this.paymentRepository.create({
      ...dto,
      tenantId,
      recordedBy,
      receiptNumber,
      status: 'pending',
    } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, paymentMethod?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (search) {
      filter.$or = [
        { receiptNumber: { $regex: search, $options: 'i' } },
        { mpesaTransactionId: { $regex: search, $options: 'i' } },
        { propertyName: { $regex: search, $options: 'i' } },
        { propertyTenantName: { $regex: search, $options: 'i' } },
        { paymentPeriod: { $regex: search, $options: 'i' } },
      ];
    }
    return this.paymentRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment || payment.isDeleted || payment.tenantId !== tenantId) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findByLease(tenantId: string, leaseId: string) {
    return this.paymentRepository.findByLease(tenantId, leaseId);
  }

  async findByProperty(tenantId: string, propertyId: string) {
    return this.paymentRepository.findByProperty(tenantId, propertyId);
  }

  async findByPropertyTenant(tenantId: string, propertyTenantId: string) {
    return this.paymentRepository.findByPropertyTenant(tenantId, propertyTenantId);
  }

  async findByDateRange(tenantId: string, startDate: string, endDate: string) {
    return this.paymentRepository.findByDateRange(tenantId, new Date(startDate), new Date(endDate));
  }

  async markCompleted(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    const payment = await this.paymentRepository.update(id, { status: 'completed' } as any);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async update(id: string, tenantId: string, dto: UpdatePaymentDto) {
    await this.findById(id, tenantId);
    const payment = await this.paymentRepository.update(id, dto as any);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.paymentRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, completed, pending, failed] = await Promise.all([
      this.paymentRepository.countByTenant(tenantId),
      this.paymentRepository.countByStatus(tenantId, 'completed'),
      this.paymentRepository.countByStatus(tenantId, 'pending'),
      this.paymentRepository.countByStatus(tenantId, 'failed'),
    ]);
    const [totalCompleted, totalPending] = await Promise.all([
      this.paymentRepository.getTotalByStatus(tenantId, 'completed'),
      this.paymentRepository.getTotalByStatus(tenantId, 'pending'),
    ]);
    const now = new Date();
    const monthlyRevenue = await this.paymentRepository.getMonthlyRevenue(tenantId, now.getFullYear(), now.getMonth() + 1);
    return { total, completed, pending, failed, totalCompleted, totalPending, monthlyRevenue };
  }
}
