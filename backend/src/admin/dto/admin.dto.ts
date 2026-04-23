import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

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
