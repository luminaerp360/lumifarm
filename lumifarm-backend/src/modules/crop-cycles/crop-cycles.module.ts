import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CropCyclesService } from './crop-cycles.service';
import { CropCyclesController } from './crop-cycles.controller';
import { CropCycle, CropCycleSchema } from './schemas/crop-cycle.schema';
import { CropCycleRepository } from './repositories/crop-cycle.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CropCycle.name, schema: CropCycleSchema }]),
  ],
  controllers: [CropCyclesController],
  providers: [CropCyclesService, CropCycleRepository],
  exports: [CropCyclesService, CropCycleRepository],
})
export class CropCyclesModule {}
