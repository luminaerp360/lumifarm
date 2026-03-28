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
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { EquipmentService } from "./equipment.service";
import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  AddMaintenanceDto,
} from "./dto/equipment.dto";

@Controller("equipment")
@UseGuards(JwtAuthGuard)
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(req.user.tenantId, dto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("search") search: string,
    @Query("status") status: string,
    @Query("category") category: string,
  ) {
    return this.equipmentService.findAll(
      req.user.tenantId,
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search,
      status,
      category,
    );
  }

  @Get("stats")
  getStats(@Req() req) {
    return this.equipmentService.getStats(req.user.tenantId);
  }

  @Get("maintenance-due")
  findNeedingMaintenance(@Req() req) {
    return this.equipmentService.findNeedingMaintenance(req.user.tenantId);
  }

  @Get("farm/:farmId")
  findByFarm(@Req() req, @Param("farmId") farmId: string) {
    return this.equipmentService.findByFarm(req.user.tenantId, farmId);
  }

  @Get(":id")
  findById(@Req() req, @Param("id") id: string) {
    return this.equipmentService.findById(req.user.tenantId, id);
  }

  @Put(":id")
  update(
    @Req() req,
    @Param("id") id: string,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(req.user.tenantId, id, dto);
  }

  @Put(":id/maintenance")
  addMaintenance(
    @Req() req,
    @Param("id") id: string,
    @Body() dto: AddMaintenanceDto,
  ) {
    return this.equipmentService.addMaintenance(req.user.tenantId, id, dto);
  }

  @Delete(":id")
  remove(@Req() req, @Param("id") id: string) {
    return this.equipmentService.remove(req.user.tenantId, id);
  }
}
