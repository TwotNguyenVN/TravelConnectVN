import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTourRequestStatusDto {
  @ApiProperty({ example: 'Đã xác nhận tham gia.', required: false })
  @IsString()
  @IsOptional()
  responseNote?: string;
}

export class CancelTourRequestDto {
  @ApiProperty({ example: 'Thay đổi kế hoạch cá nhân.', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}
