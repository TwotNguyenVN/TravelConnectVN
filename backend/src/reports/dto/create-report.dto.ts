import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateReportDto {
  @IsEnum(['tour', 'companion_post', 'user', 'guide_profile', 'tour_review', 'guide_review'])
  target_type: string;

  @IsOptional()
  @IsUUID()
  tour_id?: string;

  @IsOptional()
  @IsUUID()
  companion_post_id?: string;

  @IsOptional()
  @IsUUID()
  reported_user_id?: string;

  @IsOptional()
  @IsUUID()
  guide_profile_id?: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  description?: string;
}
