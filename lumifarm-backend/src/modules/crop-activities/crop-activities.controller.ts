import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CropActivitiesService } from './crop-activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Crop Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crop-activities')
export class CropActivitiesController {
  constructor(private readonly cropActivitiesService: CropActivitiesService) {}

  @Post()
  create(@Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.create(dto, tenantId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('cropCycleId') cropCycleId?: string,
    @Query('activityType') activityType?: string,
  ) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.findAll(tenantId, page, limit, search, status, cropCycleId, activityType);
  }

  @Get('upcoming')
  findUpcoming(@Req() req, @Query('days') days?: number) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.findUpcoming(tenantId, days);
  }

  @Get('overdue')
  findOverdue(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.findOverdue(tenantId);
  }

  @Get('stats')
  getStats(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.getStats(tenantId);
  }

  @Get('cycle/:cropCycleId')
  findByCropCycle(@Param('cropCycleId') cropCycleId: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.findByCropCycle(tenantId, cropCycleId);
  }

  @Get('cycle/:cropCycleId/summary')
  getCycleSummary(@Param('cropCycleId') cropCycleId: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.getCycleSummary(tenantId, cropCycleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.findById(id, tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.update(id, tenantId, dto);
  }

  @Put(':id/complete')
  complete(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.complete(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropActivitiesService.remove(id, tenantId);
  }
}
