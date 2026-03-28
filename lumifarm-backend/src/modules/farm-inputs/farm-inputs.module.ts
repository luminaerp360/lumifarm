import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FarmInput, FarmInputSchema } from "./schemas/farm-input.schema";
import { FarmInputRepository } from "./repositories/farm-input.repository";
import { FarmInputsService } from "./farm-inputs.service";
import { FarmInputsController } from "./farm-inputs.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FarmInput.name, schema: FarmInputSchema },
    ]),
  ],
  controllers: [FarmInputsController],
  providers: [FarmInputsService, FarmInputRepository],
  exports: [FarmInputsService, FarmInputRepository],
})
export class FarmInputsModule {}
