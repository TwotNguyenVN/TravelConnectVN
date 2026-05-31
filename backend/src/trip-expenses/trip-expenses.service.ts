import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { SettleExpenseDto } from './dto/settle-expense.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { ApiResponse } from '../common/interfaces/response.interface';

@Injectable()
export class TripExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Kiểm tra xem một user có quyền truy cập vào chi phí của bài đồng hành không
   * Quyền truy cập hợp lệ khi:
   * 1. User là chủ bài đăng
   * 2. User có yêu cầu tham gia bài đăng với trạng thái 'approved'
   */
  async validateAccess(userId: string, postId: string) {
    const post = await this.prisma.companion_posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng đồng hành');
    }

    if (post.user_id === userId) {
      return post;
    }

    const approvedRequest = await this.prisma.companion_requests.findFirst({
      where: {
        post_id: postId,
        user_id: userId,
        status: 'approved',
      },
    });

    if (!approvedRequest) {
      throw new ForbiddenException('Bạn không có quyền truy cập thông tin chi tiêu của chuyến đi này');
    }

    return post;
  }

  async getExpenses(userId: string, postId: string): Promise<ApiResponse<any>> {
    // Cast to any: Prisma include inference is correct at compile time (tsc passes),
    // but the IDE TS server doesn't properly infer bank_id and included relations.
    const post = await this.prisma.companion_posts.findUnique({
      where: { id: postId },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
            bank_id: true,
            account_no: true,
            account_name: true,
          } as any,
        },
        companion_requests: {
          where: { status: 'approved' },
          include: {
            users_companion_requests_user_idTousers: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
                bank_id: true,
                account_no: true,
                account_name: true,
              } as any,
            },
          },
        },
      },
    }) as any;

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng đồng hành');
    }

    // Kiểm tra quyền truy cập
    await this.validateAccess(userId, postId);

    // Lấy danh sách tất cả các khoản chi tiêu
    const expenses = await this.prisma.trip_expenses.findMany({
      where: { post_id: postId },
      include: {
        splits: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                avatar_url: true,
              },
            },
          },
        },
        payer: {
          select: {
            id: true,
            full_name: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { expense_date: 'desc' },
    });

    // Tạo danh sách thành viên của chuyến đi (Host + Approved Members)
    const host = {
      id: post.users.id,
      fullName: post.users.full_name || 'Chủ bài',
      avatarUrl: post.users.avatar_url,
      bankId: post.users.bank_id,
      accountNo: post.users.account_no,
      accountName: post.users.account_name,
    };

    const participants = post.companion_requests.map((req) => ({
      id: req.users_companion_requests_user_idTousers.id,
      fullName: req.users_companion_requests_user_idTousers.full_name || 'Thành viên',
      avatarUrl: req.users_companion_requests_user_idTousers.avatar_url,
      bankId: req.users_companion_requests_user_idTousers.bank_id,
      accountNo: req.users_companion_requests_user_idTousers.account_no,
      accountName: req.users_companion_requests_user_idTousers.account_name,
    }));

    const allMembers = [host, ...participants];

    // Tính toán số dư
    const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Tính tổng đã chi và phần phải chịu đối với các khoản chi CHƯA quyết toán (pending)
    const memberBalances = allMembers.map((member) => {
      // Tổng số tiền thành viên này đã trả cho các phần split chưa quyết toán
      const pendingPaid = expenses.reduce((sum, expense) => {
        if (expense.paid_by_user_id !== member.id) return sum;
        const pendingSplitsAmount = expense.splits
          .filter((s) => s.status === 'pending')
          .reduce((sSum, s) => sSum + Number(s.amount), 0);
        return sum + pendingSplitsAmount;
      }, 0);

      // Tổng số tiền thành viên này chịu trách nhiệm cho các phần split chưa quyết toán
      const pendingShare = expenses.reduce((sum, expense) => {
        const myPendingSplit = expense.splits.find(
          (s) => s.user_id === member.id && s.status === 'pending',
        );
        return sum + (myPendingSplit ? Number(myPendingSplit.amount) : 0);
      }, 0);

      // Tổng lịch sử đã chi (cả pending và settled)
      const historicalPaid = expenses
        .filter((e) => e.paid_by_user_id === member.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      // Tổng lịch sử phần phải chịu (cả pending và settled)
      const historicalShare = expenses.reduce((sum, expense) => {
        const mySplit = expense.splits.find((s) => s.user_id === member.id);
        return sum + (mySplit ? Number(mySplit.amount) : 0);
      }, 0);

      return {
        userId: member.id,
        fullName: member.fullName,
        avatarUrl: member.avatarUrl,
        bankId: member.bankId,
        accountNo: member.accountNo,
        accountName: member.accountName,
        paid: historicalPaid,
        share: historicalShare,
        netBalance: pendingPaid - pendingShare, // Chỉ dùng số dư pending để tính đề xuất quyết toán nợ
      };
    });

    // Tính toán các đề xuất quyết toán tối ưu sử dụng thuật toán tham lam (Greedy)
    const creditors = memberBalances
      .filter((m) => m.netBalance > 0.01)
      .map((m) => ({ ...m }));
    const debtors = memberBalances
      .filter((m) => m.netBalance < -0.01)
      .map((m) => ({ ...m, netBalance: Math.abs(m.netBalance) }));

    const suggestedSettlements: any[] = [];

    let cIdx = 0;
    let dIdx = 0;

    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx];
      const debtor = debtors[dIdx];

      const settleAmount = Math.min(creditor.netBalance, debtor.netBalance);

      suggestedSettlements.push({
        debtorId: debtor.userId,
        debtorName: debtor.fullName,
        creditorId: creditor.userId,
        creditorName: creditor.fullName,
        creditorBankId: creditor.bankId,
        creditorAccountNo: creditor.accountNo,
        creditorAccountName: creditor.accountName,
        amount: Math.round(settleAmount),
      });

      creditor.netBalance -= settleAmount;
      debtor.netBalance -= settleAmount;

      if (creditor.netBalance <= 0.01) cIdx++;
      if (debtor.netBalance <= 0.01) dIdx++;
    }

    return {
      success: true,
      message: 'Lấy dữ liệu chi tiêu nhóm thành công',
      data: {
        expenses,
        members: allMembers,
        summary: {
          totalAmount,
          memberBalances: memberBalances.map((m) => ({
            ...m,
            netBalance: Math.round(m.netBalance),
          })),
          suggestedSettlements,
        },
      },
    };
  }

  async createExpense(
    userId: string,
    postId: string,
    data: CreateExpenseDto,
  ): Promise<ApiResponse<any>> {
    await this.validateAccess(userId, postId);

    // Tạo bản ghi chi tiêu chính
    const expense = await this.prisma.trip_expenses.create({
      data: {
        post_id: postId,
        title: data.title,
        amount: data.amount,
        paid_by_user_id: data.paidByUserId,
        created_by_user_id: userId,
        expense_date: new Date(data.expenseDate),
      },
    });

    // Tạo các bản ghi chi tiết chia tiền
    const splitPromises = data.splits.map((split) =>
      this.prisma.trip_expense_splits.create({
        data: {
          expense_id: expense.id,
          user_id: split.userId,
          amount: split.amount,
          status: 'pending',
        },
      }),
    );

    await Promise.all(splitPromises);

    return {
      success: true,
      message: 'Thêm khoản chi tiêu mới thành công',
      data: expense,
    };
  }

  async deleteExpense(
    userId: string,
    postId: string,
    expenseId: string,
  ): Promise<ApiResponse<any>> {
    await this.validateAccess(userId, postId);

    const expense = await this.prisma.trip_expenses.findUnique({
      where: { id: expenseId },
    });

    if (!expense) {
      throw new NotFoundException('Không tìm thấy khoản chi tiêu');
    }

    if (expense.post_id !== postId) {
      throw new ForbiddenException('Khoản chi tiêu không thuộc chuyến đi này');
    }

    // Chỉ người tạo hoặc chủ bài đăng được phép xóa
    const post = await this.prisma.companion_posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng đồng hành');
    }

    if (expense.created_by_user_id !== userId && post.user_id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa khoản chi này');
    }

    await this.prisma.trip_expenses.delete({
      where: { id: expenseId },
    });

    return {
      success: true,
      message: 'Xóa khoản chi tiêu thành công',
    };
  }

  async settleDebts(
    userId: string,
    postId: string,
    data: SettleExpenseDto,
  ): Promise<ApiResponse<any>> {
    await this.validateAccess(userId, postId);

    // Tìm tất cả các splits chưa quyết toán của con nợ (debtorId)
    // nằm trong các khoản chi của chủ nợ (creditorId) thuộc chuyến đi này
    const pendingSplits = await this.prisma.trip_expense_splits.findMany({
      where: {
        user_id: data.debtorId,
        status: 'pending',
        expense: {
          post_id: postId,
          paid_by_user_id: data.creditorId,
        },
      },
    });

    if (pendingSplits.length === 0) {
      return {
        success: true,
        message: 'Không có khoản nợ nào cần quyết toán giữa hai thành viên này',
      };
    }

    // Đánh dấu tất cả các splits này là settled
    await this.prisma.trip_expense_splits.updateMany({
      where: {
        user_id: data.debtorId,
        status: 'pending',
        expense: {
          post_id: postId,
          paid_by_user_id: data.creditorId,
        },
      },
      data: {
        status: 'settled',
        settled_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'Quyết toán nợ thành công',
    };
  }

  async updateMyBank(userId: string, data: UpdateBankDto): Promise<ApiResponse<any>> {
    // Cast data to any: bank_id/account_no/account_name exist in schema but
    // IDE TS server doesn't detect them due to skipLibCheck difference.
    const updatedUser = await this.prisma.public_users.update({
      where: { id: userId },
      data: {
        bank_id: data.bankId,
        account_no: data.accountNo,
        account_name: data.accountName,
      } as any,
    }) as any;

    return {
      success: true,
      message: 'Cập nhật tài khoản ngân hàng thành công',
      data: {
        bankId: updatedUser.bank_id,
        accountNo: updatedUser.account_no,
        accountName: updatedUser.account_name,
      },
    };
  }
}
