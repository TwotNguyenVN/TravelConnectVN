import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  LOCKED = 'locked',
}

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class AssignRoleDto {
  @IsString()
  roleCode: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class ModerationDto {
  @IsEnum(['visible', 'hidden', 'flagged'])
  visibility_status: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class ProcessReportDto {
  @IsEnum(['assigned', 'in_review', 'resolved', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  resolution_note?: string;
}

export class ProcessVerificationDto {
  @IsEnum(['approved', 'rejected'])
  status: string;

  @IsOptional()
  @IsString()
  result_note?: string;
}

export class CreateStaffDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(['CONTENT_MODERATOR', 'SUPPORT_STAFF', 'ACCOUNTANT'])
  roleCode: string;
}

export class AnalyzeContentDto {
  @IsString()
  text: string;
}

export class UpdateTransactionStatusDto {
  @IsEnum(['pending', 'paid', 'failed', 'cancelled'])
  status: string;
}

export class UpdateSettingDto {
  @IsString()
  value: string;
}

export class CategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
