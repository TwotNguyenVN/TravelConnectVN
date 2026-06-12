import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean, 
  IsNumber, 
  IsArray, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class TourItineraryItemDto {
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  hasBreakfast?: boolean;

  @IsBoolean()
  @IsOptional()
  hasLunch?: boolean;

  @IsBoolean()
  @IsOptional()
  hasDinner?: boolean;

  @IsString()
  @IsOptional()
  accommodation?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  visitTime?: string;
}

export class TourDestinationItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  googleMapsLink?: string;

  @IsOptional()
  lat?: number | string;

  @IsOptional()
  lng?: number | string;
}

export class TourImageItemDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsBoolean()
  @IsOptional()
  isCover?: boolean;
}

export class TourScheduleItemDto {
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  price?: number | string;

  @IsOptional()
  maxParticipants?: number | string;
}

export class TourAccommodationItemDto {
  @IsString()
  @IsNotEmpty()
  accommodationId: string;

  @IsString()
  @IsOptional()
  checkInDate?: string;

  @IsString()
  @IsOptional()
  checkOutDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  categoryId?: string | number;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsOptional()
  numDays?: number | string;

  @IsOptional()
  numNights?: number | string;

  @IsOptional()
  price?: number | string;

  @IsOptional()
  maxParticipants?: number | string;

  @IsString()
  @IsOptional()
  meetPoint?: string;

  @IsString()
  @IsOptional()
  meetAddress?: string;

  @IsString()
  @IsOptional()
  meetTime?: string;

  @IsOptional()
  meetLatitude?: number | string;

  @IsOptional()
  meetLongitude?: number | string;

  @IsString()
  @IsOptional()
  googleMapsLink?: string;

  @IsString()
  @IsOptional()
  routeMapLink?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  participantRequirements?: string;

  @IsString()
  @IsOptional()
  businessStatus?: string;

  @IsString()
  @IsOptional()
  visibilityStatus?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  otherProvinces?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourItineraryItemDto)
  @IsOptional()
  itinerary?: TourItineraryItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDestinationItemDto)
  @IsOptional()
  destinations?: TourDestinationItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourImageItemDto)
  @IsOptional()
  images?: TourImageItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourScheduleItemDto)
  @IsOptional()
  schedules?: TourScheduleItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourAccommodationItemDto)
  @IsOptional()
  accommodations?: TourAccommodationItemDto[];
}

export class UpdateTourDto extends PartialType(CreateTourDto) {}

export interface TourFilterDto {
  status?: string;
  keyword?: string;
  page?: number | string;
  limit?: number | string;
  province?: string;
  categoryId?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  startDate?: string;
  sortBy?: string;
}
