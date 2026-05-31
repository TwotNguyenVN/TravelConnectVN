import { IsNotEmpty, IsUUID } from 'class-validator';

export class SettleExpenseDto {
  @IsUUID()
  @IsNotEmpty()
  debtorId: string;

  @IsUUID()
  @IsNotEmpty()
  creditorId: string;
}
