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
import { FarmInputsService } from "./farm-inputs.service";
import { CreateFarmInputDto, UpdateFarmInputDto } from "./dto/farm-input.dto";

@Controller("farm-inputs")
@UseGuards(JwtAuthGuard)
export class FarmInputsController {
  constructor(private readonly farmInputsService: FarmInputsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateFarmInputDto) {
    return this.farmInputsService.create(req.user.tenantId, dto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query("cropCycleId") cropCycleId: string,
    @Query("category") category: string,
    @Query("search") search: string,
  ) {
    return this.farmInputsService.findAll(
      req.user.tenantId,
      parseInt(page) || 1,
      parseInt(limit) || 20,
      cropCycleId,
      category,
      search,
    );
  }

  @Get("cycle/:cropCycleId")
  findByCropCycle(@Req() req, @Param("cropCycleId") cropCycleId: string) {
    return this.farmInputsService.findByCropCycle(
      req.user.tenantId,
      cropCycleId,
    );
  }

  @Get("cycle/:cropCycleId/summary")
  getSummary(@Req() req, @Param("cropCycleId") cropCycleId: string) {
    return this.farmInputsService.getSummary(req.user.tenantId, cropCycleId);
  }

  @Get(":id")
  findById(@Req() req, @Param("id") id: string) {
    return this.farmInputsService.findById(req.user.tenantId, id);
  }

  @Put(":id")
  update(@Req() req, @Param("id") id: string, @Body() dto: UpdateFarmInputDto) {
    return this.farmInputsService.update(req.user.tenantId, id, dto);
  }

  @Delete(":id")
  remove(@Req() req, @Param("id") id: string) {
    return this.farmInputsService.remove(req.user.tenantId, id);
  }
}
