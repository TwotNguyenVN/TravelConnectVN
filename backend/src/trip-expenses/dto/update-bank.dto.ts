import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBankDto {
  @IsString()
  @IsNotEmpty()
  bankId: string;

  @IsString()
  @IsNotEmpty()
  accountNo: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;
}
