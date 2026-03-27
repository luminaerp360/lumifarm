import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IssueType, IssueSeverity, IssueStatus } from '../schemas/crop-issue.schema';

export class CreateCropIssueDto {
  @IsString()
  @IsOptional()
  farmId?: string;

  @IsString()
  @IsOptional()
  plotId?: string;

  @IsString()
  @IsOptional()
  cropCycleId?: string;

  @IsEnum(IssueType)
  @IsNotEmpty()
  issueType: IssueType;

  @IsEnum(IssueSeverity)
  @IsOptional()
  severity?: IssueSeverity;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  affectedArea?: string;

  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  remedialMeasure?: string;

  @IsNumber()
  @IsOptional()
  costToFix?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDate()
  @IsOptional()
  reportedDate?: Date;

  @IsString()
  @IsOptional()
  reportedBy?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  pestName?: string;

  @IsString()
  @IsOptional()
  diseaseName?: string;

  @IsString()
  @IsOptional()
  chemicalUsed?: string;
}

export class UpdateCropIssueDto extends PartialType(CreateCropIssueDto) {
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsDate()
  @IsOptional()
  treatedDate?: Date;

  @IsDate()
  @IsOptional()
  resolvedDate?: Date;

  @IsString()
  @IsOptional()
  treatedBy?: string;
}
