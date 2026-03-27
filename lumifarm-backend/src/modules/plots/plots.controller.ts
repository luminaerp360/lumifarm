import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PlotsService } from './plots.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Plots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plots')
export class PlotsController {
  constructor(private readonly plotsService: PlotsService) {}

  @Post()
  create(@Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.create(dto, tenantId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('farmId') farmId?: string,
  ) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.findAll(tenantId, page, limit, search, status, farmId);
  }

  @Get('farm/:farmId')
  findByFarm(@Param('farmId') farmId: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.findByFarm(tenantId, farmId);
  }

  @Get('stats/:farmId')
  getStats(@Param('farmId') farmId: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.getStats(tenantId, farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.findById(id, tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.update(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.plotsService.remove(id, tenantId);
  }
}
