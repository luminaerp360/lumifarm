import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CropIssuesService } from './crop-issues.service';
import { CropIssuesController } from './crop-issues.controller';
import { CropIssue, CropIssueSchema } from './schemas/crop-issue.schema';
import { CropIssueRepository } from './repositories/crop-issue.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CropIssue.name, schema: CropIssueSchema }]),
  ],
  controllers: [CropIssuesController],
  providers: [CropIssuesService, CropIssueRepository],
  exports: [CropIssuesService, CropIssueRepository],
})
export class CropIssuesModule {}
