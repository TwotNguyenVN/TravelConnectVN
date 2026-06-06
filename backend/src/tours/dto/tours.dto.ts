export class TourItineraryItemDto {
  locationName: string;
  address?: string;
  notes?: string;
  hasBreakfast?: boolean;
  hasLunch?: boolean;
  hasDinner?: boolean;
  accommodation?: string;
  note?: string;
  latitude?: number;
  longitude?: number;
  visitTime?: string;
}

export class TourDestinationItemDto {
  name: string;
  address?: string;
  googleMapsLink?: string;
  lat?: number | string;
  lng?: number | string;
}

export class TourImageItemDto {
  imageUrl: string;
  caption?: string;
  isCover?: boolean;
}

export class TourScheduleItemDto {
  startDate: string;
  price?: number | string;
  maxParticipants?: number | string;
}

export class TourAccommodationItemDto {
  accommodationId: string;
  checkInDate?: string;
  checkOutDate?: string;
  notes?: string;
}

export class CreateTourDto {
  title: string;
  categoryId?: string | number;
  province: string;
  district?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  numDays?: number | string;
  numNights?: number | string;
  price?: number | string;
  maxParticipants?: number | string;
  meetPoint?: string;
  meetAddress?: string;
  meetTime?: string;
  meetLatitude?: number | string;
  meetLongitude?: number | string;
  googleMapsLink?: string;
  routeMapLink?: string;
  description?: string;
  participantRequirements?: string;
  businessStatus?: string;
  visibilityStatus?: string;
  otherProvinces?: string[];
  itinerary?: TourItineraryItemDto[];
  destinations?: TourDestinationItemDto[];
  images?: TourImageItemDto[];
  schedules?: TourScheduleItemDto[];
  accommodations?: TourAccommodationItemDto[];
}

import { PartialType } from '@nestjs/swagger';

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
