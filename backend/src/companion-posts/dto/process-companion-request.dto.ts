import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessCompanionRequestDto {
  @ApiProperty({ example: 'Great to have you!', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  responseNote?: string;
}
