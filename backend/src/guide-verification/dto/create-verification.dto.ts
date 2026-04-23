import { IsString, IsOptional, IsArray, ValidateNested, IsUrl, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class VerificationDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentType: string;

  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;
}

export class CreateVerificationRequestDto {
  @IsString()
  @IsOptional()
  submissionNote?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VerificationDocumentDto)
  documents: VerificationDocumentDto[];
}
