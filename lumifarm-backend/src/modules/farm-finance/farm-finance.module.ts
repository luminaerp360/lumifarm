import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmFinanceService } from './farm-finance.service';
import { FarmFinanceController } from './farm-finance.controller';
import { FarmFinance, FarmFinanceSchema } from './schemas/farm-finance.schema';
import { FarmFinanceRepository } from './repositories/farm-finance.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FarmFinance.name, schema: FarmFinanceSchema }]),
  ],
  controllers: [FarmFinanceController],
  providers: [FarmFinanceService, FarmFinanceRepository],
  exports: [FarmFinanceService, FarmFinanceRepository],
})
export class FarmFinanceModule {}
