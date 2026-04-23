import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanionRequestDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000000' })
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ example: 'Hi, I would love to join your trip!', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  message?: string;
}
