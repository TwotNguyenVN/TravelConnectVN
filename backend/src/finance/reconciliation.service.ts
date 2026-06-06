import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface StatementRow {
  transactionCode: string;
  amount: number;
  date: string;
  description: string;
}

@Injectable()
export class ReconciliationService {
  constructor(private prisma: PrismaService) {}

  async reconcileTransactions(statementRows: StatementRow[]) {
    // Lấy tất cả các giao dịch trong hệ thống có mã nằm trong danh sách sao kê
    const txCodes = statementRows.map(row => row.transactionCode).filter(Boolean);
    const dbTx = await this.prisma.payment_transactions.findMany({
      where: {
        provider_transaction_code: { in: txCodes }
      }
    });

    const dbTxMap = new Map(dbTx.map(tx => [tx.provider_transaction_code, tx]));

    const matched = [];
    const mismatched = [];
    const notFound = [];

    // Map các row
    for (const row of statementRows) {
      if (!row.transactionCode) continue;

      const tx = dbTxMap.get(row.transactionCode);
      if (!tx) {
        notFound.push(row);
      } else {
        // So sánh amount
        if (Number(tx.amount) === Number(row.amount)) {
          matched.push({ row, tx });
        } else {
          mismatched.push({
            row,
            tx,
            diff: Number(row.amount) - Number(tx.amount)
          });
        }
        dbTxMap.delete(row.transactionCode);
      }
    }

    // Những giao dịch còn lại trong dbTxMap là extra (có trong DB nhưng không có trong file)
    const extra = Array.from(dbTxMap.values());

    return {
      summary: {
        totalRows: statementRows.length,
        matched: matched.length,
        mismatched: mismatched.length,
        notFound: notFound.length,
        extra: extra.length,
      },
      matched,
      mismatched,
      notFound,
      extra
    };
  }
}
