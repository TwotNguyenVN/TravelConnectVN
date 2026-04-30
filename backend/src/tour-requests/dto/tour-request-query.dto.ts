import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TourRequestQueryDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  tourId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: number;
}
