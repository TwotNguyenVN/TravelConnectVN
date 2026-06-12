import { IsOptional, IsString, IsNumber, IsBoolean, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class TourItineraryItemDto {
  @IsString()
  locationName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  hasBreakfast?: boolean;

  @IsOptional()
  @IsBoolean()
  hasLunch?: boolean;

  @IsOptional()
  @IsBoolean()
  hasDinner?: boolean;

  @IsOptional()
  @IsString()
  accommodation?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  visitTime?: string;
}

export class TourDestinationItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  googleMapsLink?: string;

  @IsOptional()
  lat?: number | string;

  @IsOptional()
  lng?: number | string;
}

export class TourImageItemDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsBoolean()
  isCover?: boolean;
}

export class TourScheduleItemDto {
  @IsString()
  startDate: string;

  @IsOptional()
  price?: number | string;

  @IsOptional()
  maxParticipants?: number | string;
}

export class TourAccommodationItemDto {
  @IsString()
  accommodationId: string;

  @IsOptional()
  @IsString()
  checkInDate?: string;

  @IsOptional()
  @IsString()
  checkOutDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateTourDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  categoryId?: string | number;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  numDays?: number | string;

  @IsOptional()
  numNights?: number | string;

  @IsOptional()
  price?: number | string;

  @IsOptional()
  maxParticipants?: number | string;

  @IsOptional()
  @IsString()
  meetPoint?: string;

  @IsOptional()
  @IsString()
  meetAddress?: string;

  @IsOptional()
  @IsString()
  meetTime?: string;

  @IsOptional()
  meetLatitude?: number | string;

  @IsOptional()
  meetLongitude?: number | string;

  @IsOptional()
  @IsString()
  googleMapsLink?: string;

  @IsOptional()
  @IsString()
  routeMapLink?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  participantRequirements?: string;

  @IsOptional()
  @IsString()
  businessStatus?: string;

  @IsOptional()
  @IsString()
  visibilityStatus?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherProvinces?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourItineraryItemDto)
  itinerary?: TourItineraryItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourDestinationItemDto)
  destinations?: TourDestinationItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourImageItemDto)
  images?: TourImageItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourScheduleItemDto)
  schedules?: TourScheduleItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TourAccommodationItemDto)
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
