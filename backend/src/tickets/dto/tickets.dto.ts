import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum TicketCategory {
  PAYMENT = 'payment',
  DISPUTE = 'dispute',
  ACCOUNT = 'account',
  OTHER = 'other',
}

export enum TicketStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TicketCategory)
  category: TicketCategory;
}

export class UpdateTicketDto {
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsUUID()
  @IsOptional()
  assignedToUserId?: string;
}
