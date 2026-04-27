import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, Min, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanionPostDto {
  @ApiProperty({ example: 'Looking for someone to join me in Da Lat' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Da Lat, Vietnam' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-05-05' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ example: 1000000, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  estimatedCost?: number;

  @ApiProperty({ example: 'VND', required: false, default: 'VND' })
  @IsString()
  @IsOptional()
  @MaxLength(3)
  currencyCode?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  expectedMembers: number;

  @ApiProperty({ example: 'Detailed plan for the trip...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Must be friendly and love hiking', required: false })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiProperty({ example: [], required: false })
  @IsOptional()
  images?: any[];
}
