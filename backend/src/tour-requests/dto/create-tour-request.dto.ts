import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourRequestDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d' })
  @IsUUID()
  @IsNotEmpty()
  tourId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', required: false })
  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  participantCount: number;

  @ApiProperty({ example: 'Tôi muốn tham gia cùng bạn.', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
