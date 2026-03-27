import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeasesService } from './leases.service';
import { LeasesController } from './leases.controller';
import { Lease, LeaseSchema } from './schemas/lease.schema';
import { LeaseRepository } from './repositories/lease.repository';
import { UnitsModule } from '../units/units.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lease.name, schema: LeaseSchema }]),
    forwardRef(() => UnitsModule),
  ],
  controllers: [LeasesController],
  providers: [LeasesService, LeaseRepository],
  exports: [LeasesService, LeaseRepository],
})
export class LeasesModule {}
