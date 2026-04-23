import { IsString, IsNumber, Min, Max, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTourReviewDto {
  @ApiProperty({ example: 'uuid-of-tour-request' })
  @IsUUID()
  @IsNotEmpty()
  tourRequestId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Chuyến đi rất tuyệt vời!' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class CreateGuideReviewDto {
  @ApiProperty({ example: 'uuid-of-tour-request' })
  @IsUUID()
  @IsNotEmpty()
  tourRequestId: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Hướng dẫn viên rất nhiệt tình!' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
