import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmWorkersService } from './farm-workers.service';
import { FarmWorkersController } from './farm-workers.controller';
import { FarmWorker, FarmWorkerSchema } from './schemas/farm-worker.schema';
import { FarmWorkerRepository } from './repositories/farm-worker.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FarmWorker.name, schema: FarmWorkerSchema }]),
  ],
  controllers: [FarmWorkersController],
  providers: [FarmWorkersService, FarmWorkerRepository],
  exports: [FarmWorkersService, FarmWorkerRepository],
})
export class FarmWorkersModule {}
