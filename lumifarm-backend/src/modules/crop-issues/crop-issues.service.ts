import { Injectable, NotFoundException } from '@nestjs/common';
import { CropIssueRepository } from './repositories/crop-issue.repository';
import { CreateCropIssueDto, UpdateCropIssueDto } from './dto/crop-issue.dto';

@Injectable()
export class CropIssuesService {
  constructor(private readonly cropIssueRepository: CropIssueRepository) {}

  async create(dto: CreateCropIssueDto, tenantId: string) {
    return this.cropIssueRepository.create({
      ...dto,
      tenantId,
      reportedDate: dto.reportedDate || new Date(),
    } as any);
  }

  async findAll(tenantId: string, page = 1, limit = 20, search?: string, status?: string, severity?: string) {
    const filter: any = { tenantId };
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { diagnosis: { $regex: search, $options: 'i' } },
        { pestName: { $regex: search, $options: 'i' } },
      ];
    }

    return this.cropIssueRepository.findPaginated({ page, limit, filter });
  }

  async findById(id: string, tenantId: string) {
    const issue = await this.cropIssueRepository.findById(id);
    if (!issue || issue.isDeleted || issue.tenantId !== tenantId) {
      throw new NotFoundException('Crop issue not found');
    }
    return issue;
  }

  async findUnresolved(tenantId: string) {
    return this.cropIssueRepository.findUnresolved(tenantId);
  }

  async findCritical(tenantId: string) {
    return this.cropIssueRepository.findCriticalIssues(tenantId);
  }

  async update(id: string, tenantId: string, dto: UpdateCropIssueDto) {
    await this.findById(id, tenantId);
    const issue = await this.cropIssueRepository.update(id, dto as any);
    if (!issue) throw new NotFoundException('Crop issue not found');
    return issue;
  }

  async remove(id: string, tenantId: string) {
    await this.findById(id, tenantId);
    return this.cropIssueRepository.delete(id);
  }

  async getStats(tenantId: string) {
    const [total, reported, in_treatment, resolved, critical] = await Promise.all([
      this.cropIssueRepository.countByStatus(tenantId, 'reported'),
      this.cropIssueRepository.countByStatus(tenantId, 'reported'),
      this.cropIssueRepository.countByStatus(tenantId, 'in_treatment'),
      this.cropIssueRepository.countByStatus(tenantId, 'resolved'),
      this.cropIssueRepository.countByStatus(tenantId, 'critical'),
    ]);
    return { total, reported, in_treatment, resolved, critical };
  }
}
