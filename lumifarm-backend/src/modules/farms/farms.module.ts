import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { Farm, FarmSchema } from './schemas/farm.schema';
import { FarmRepository } from './repositories/farm.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farm.name, schema: FarmSchema }]),
  ],
  controllers: [FarmsController],
  providers: [FarmsService, FarmRepository],
  exports: [FarmsService, FarmRepository],
})
export class FarmsModule {}
