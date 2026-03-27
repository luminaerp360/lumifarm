import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CropIssuesService } from './crop-issues.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Crop Issues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crop-issues')
export class CropIssuesController {
  constructor(private readonly cropIssuesService: CropIssuesService) {}

  @Post()
  create(@Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.create(dto, tenantId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('severity') severity?: string,
  ) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.findAll(tenantId, page, limit, search, status, severity);
  }

  @Get('unresolved')
  findUnresolved(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.findUnresolved(tenantId);
  }

  @Get('critical')
  findCritical(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.findCritical(tenantId);
  }

  @Get('stats')
  getStats(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.getStats(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.findById(id, tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.update(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.cropIssuesService.remove(id, tenantId);
  }
}
