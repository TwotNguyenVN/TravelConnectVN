import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanionPostQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startDateFrom?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startDateTo?: string;

  @ApiProperty({ required: false, default: 'open' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false, default: '1' })
  @IsNumberString()
  @IsOptional()
  page?: string;

  @ApiProperty({ required: false, default: '10' })
  @IsNumberString()
  @IsOptional()
  limit?: string;

  @ApiProperty({ required: false, default: 'created_at:desc' })
  @IsString()
  @IsOptional()
  sortBy?: string;
}
