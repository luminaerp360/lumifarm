import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.tenantId, dto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
    @Query('status') status: string,
    @Query('priority') priority: string,
    @Query('category') category: string,
    @Query('assignedToId') assignedToId: string,
    @Query('farmId') farmId: string,
    @Query('cropCycleId') cropCycleId: string,
  ) {
    return this.tasksService.findAll(
      req.user.tenantId,
      parseInt(page) || 1,
      parseInt(limit) || 20,
      { search, status, priority, category, assignedToId, farmId, cropCycleId },
    );
  }

  @Get('upcoming')
  findUpcoming(@Req() req, @Query('days') days: string) {
    return this.tasksService.findUpcoming(req.user.tenantId, parseInt(days) || 7);
  }

  @Get('overdue')
  findOverdue(@Req() req) {
    return this.tasksService.findOverdue(req.user.tenantId);
  }

  @Get('stats')
  getStats(@Req() req) {
    return this.tasksService.getStats(req.user.tenantId);
  }

  @Get('cycle/:cropCycleId')
  findByCropCycle(@Req() req, @Param('cropCycleId') cropCycleId: string) {
    return this.tasksService.findByCropCycle(req.user.tenantId, cropCycleId);
  }

  @Get('worker/:workerId')
  findByWorker(@Req() req, @Param('workerId') workerId: string) {
    return this.tasksService.findByWorker(req.user.tenantId, workerId);
  }

  @Get(':id')
  findById(@Req() req, @Param('id') id: string) {
    return this.tasksService.findById(req.user.tenantId, id);
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user.tenantId, id, dto);
  }

  @Put(':id/complete')
  complete(@Req() req, @Param('id') id: string) {
    return this.tasksService.complete(req.user.tenantId, id);
  }

  @Put(':id/cancel')
  cancel(@Req() req, @Param('id') id: string) {
    return this.tasksService.cancel(req.user.tenantId, id);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.tasksService.remove(req.user.tenantId, id);
  }
}
