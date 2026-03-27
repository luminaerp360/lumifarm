import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlotsService } from './plots.service';
import { PlotsController } from './plots.controller';
import { Plot, PlotSchema } from './schemas/plot.schema';
import { PlotRepository } from './repositories/plot.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plot.name, schema: PlotSchema }]),
  ],
  controllers: [PlotsController],
  providers: [PlotsService, PlotRepository],
  exports: [PlotsService, PlotRepository],
})
export class PlotsModule {}
