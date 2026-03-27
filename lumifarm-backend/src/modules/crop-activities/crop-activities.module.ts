import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CropActivitiesService } from './crop-activities.service';
import { CropActivitiesController } from './crop-activities.controller';
import { CropActivity, CropActivitySchema } from './schemas/crop-activity.schema';
import { CropActivityRepository } from './repositories/crop-activity.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CropActivity.name, schema: CropActivitySchema }]),
  ],
  controllers: [CropActivitiesController],
  providers: [CropActivitiesService, CropActivityRepository],
  exports: [CropActivitiesService, CropActivityRepository],
})
export class CropActivitiesModule {}
