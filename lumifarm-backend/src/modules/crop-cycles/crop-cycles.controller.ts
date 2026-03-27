import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CropCyclesService } from './crop-cycles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Crop Cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crop-cycles')
export class CropCyclesController {
  constructor(private readonly cropCyclesService: CropCyclesService) {}

  @Post()
  create(@Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.create(dto, tenantId);
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
    return this.cropCyclesService.findAll(tenantId, page, limit, search, status, farmId);
  }

  @Get('active')
  findActive(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.findActive(tenantId);
  }

  @Get('farm/:farmId')
  findByFarm(@Param('farmId') farmId: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.findByFarm(tenantId, farmId);
  }

  @Get('stats')
  getStats(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.getStats(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.findById(id, tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.update(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropCyclesService.remove(id, tenantId);
  }
}
