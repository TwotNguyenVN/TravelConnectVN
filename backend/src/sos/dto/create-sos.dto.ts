import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSosDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsUUID()
  @IsOptional()
  tourId?: string;
}

export class ResolveSosDto {
  @IsString()
  note: string;
}
