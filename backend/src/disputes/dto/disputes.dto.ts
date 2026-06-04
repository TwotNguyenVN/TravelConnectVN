import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  reason: string;
}

export class ResolveDisputeDto {
  @IsString()
  resolutionNote: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  refundAmount?: number;
}
