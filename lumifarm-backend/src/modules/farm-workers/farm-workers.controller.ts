import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { FarmWorkersService } from './farm-workers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Farm Workers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('farm-workers')
export class FarmWorkersController {
  constructor(private readonly farmWorkersService: FarmWorkersService) {}

  @Post()
  create(@Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmWorkersService.create(dto, tenantId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ) {
    const tenantId = req.user?.tenantId || '';
    const active = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.farmWorkersService.findAll(tenantId, page, limit, search, role, active);
  }

  @Get('active')
  findActive(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmWorkersService.findActive(tenantId);
  }

  @Get('stats')
  getStats(@Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmWorkersService.getStats(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmWorkersService.findById(id, tenantId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmWorkersService.update(id, tenantId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const tenantId = req.user?.tenantId || '';
    return this.farmWorkersService.remove(id, tenantId);
  }
}
