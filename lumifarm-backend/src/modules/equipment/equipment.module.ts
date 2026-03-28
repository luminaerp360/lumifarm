import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EquipmentService } from "./equipment.service";
import { EquipmentController } from "./equipment.controller";
import { Equipment, EquipmentSchema } from "./schemas/equipment.schema";
import { EquipmentRepository } from "./repositories/equipment.repository";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService, EquipmentRepository],
  exports: [EquipmentService, EquipmentRepository],
})
export class EquipmentModule {}
