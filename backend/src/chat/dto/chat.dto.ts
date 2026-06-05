import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateDirectDto {
  @IsUUID()
  guideUserId: string;

  @IsUUID()
  @IsOptional()
  relatedTourId?: string;

  @IsString()
  @IsOptional()
  initialMessage?: string;
}

export class CreateGroupCompanionDto {
  @IsUUID()
  companionPostId: string;
}

export class SendMessageDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  messageType?: string;
}
