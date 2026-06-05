import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateGuideProfileDto {
  @IsString()
  bio: string;

  @IsNumber()
  yearsOfExperience: number;

  @IsString()
  workingArea: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  visibilityStatus?: string;

  @IsBoolean()
  @IsOptional()
  isAcceptingTours?: boolean;

  @IsString()
  @IsOptional()
  otherLanguages?: string;

  @IsString()
  @IsOptional()
  otherSkills?: string;

  @IsNumber()
  @IsOptional()
  homeProvinceId?: number;

  @IsString()
  @IsOptional()
  familiarProvinces?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;
}

export class UpdateGuideProfileDto extends CreateGuideProfileDto {}

export class GetGuidesQueryDto {
  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  workingArea?: string;

  @IsString()
  @IsOptional()
  keyword?: string;
}
