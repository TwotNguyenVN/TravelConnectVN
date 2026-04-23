import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanionPostDto } from './create-companion-post.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCompanionPostDto extends PartialType(CreateCompanionPostDto) {
  @IsString()
  @IsOptional()
  businessStatus?: string;

  @IsString()
  @IsOptional()
  visibilityStatus?: string;
}
