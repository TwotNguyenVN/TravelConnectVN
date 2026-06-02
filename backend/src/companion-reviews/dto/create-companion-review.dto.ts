import { IsString, IsNumber, Min, Max, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanionReviewDto {
  @ApiProperty({ example: 'uuid-of-companion-post' })
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ example: 'uuid-of-companion-request' })
  @IsUUID()
  @IsNotEmpty()
  requestId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Chủ bài đăng rất thân thiện và nhiệt tình!' })
  @IsString()
  @IsOptional()
  comment?: string;
}
