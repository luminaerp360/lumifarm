import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { FarmFinanceService } from './farm-finance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Farm Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('farm-finance')
export class FarmFinanceController {
  constructor(private readonly farmFinanceService: FarmFinanceService) {}

  @Post()
  create(@Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    const userId = req.user?.userId || '';
    return this.farmFinanceService.create(dto, tenantId, userId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('transactionType') transactionType?: string,
    @Query('category') category?: string,
  ) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.findAll(tenantId, page, limit, search, transactionType, category);
  }

  @Get('summary')
  getFinancialSummary(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.getFinancialSummary(tenantId);
  }

  @Get('expenses')
  getExpenses(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.findExpenses(tenantId);
  }

  @Get('income')
  getIncome(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.findIncome(tenantId);
  }

  @Get('pending-payments')
  getPendingPayments(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.getPendingPayments(tenantId);
  }

  @Get('overdue-payments')
  getOverduePayments(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.getOverduePayments(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.findById(id, tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.update(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmFinanceService.remove(id, tenantId);
  }
}
