# 📝 KẾ HOẠCH TRIỂN KHAI: SỬA LỖI LOGIC & CÔNG NỢ NGHIỆP VỤ (TRAVELCONNECTVN)

Tài liệu này mô tả chi tiết phương án xử lý 4 vấn đề nghiệp vụ và lỗi logic nghiêm trọng trong hệ thống, bao gồm cách sửa đổi code cụ thể ở backend và các bước xác minh.

---

## 1. Danh sách các file thay đổi (Proposed Changes)

### 📂 Backend Components

#### [MODIFY] [trip-expenses.service.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/trip-expenses/trip-expenses.service.ts)
*   Cập nhật hàm `settleDebts` để thực hiện quyết toán nợ thông minh:
    1.  Chạy thuật toán Greedy tính toán số dư thực tế giống hệt hàm `getExpenses`.
    2.  Tìm khoản tiền chính xác (`settleAmount`) mà `debtorId` cần chuyển cho `creditorId`.
    3.  Tự động khấu trừ và cập nhật trạng thái `settled` cho các `trip_expense_splits` liên quan:
        *   Tìm tất cả các split `pending` của con nợ (debtor) trong chuyến đi, trừ dần theo số tiền quyết toán. Nếu số tiền split lớn hơn số nợ cần trừ, tiến hành chia nhỏ split (tạo một split mới trạng thái `settled` và cập nhật split cũ với số tiền còn lại).
        *   Tương tự, tìm các split `pending` của thành viên khác nằm dưới các khoản chi của chủ nợ (creditor), trừ dần và chuyển trạng thái tương ứng để cân bằng cán cân tài chính của nhóm.

#### [MODIFY] [tour-requests.service.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/tour-requests/tour-requests.service.ts)
*   Cập nhật hàm `createRequest` để kiểm tra và bắt buộc chọn lịch khởi hành (`scheduleId`):
    1.  Kiểm tra xem tour có bất kỳ lịch trình khởi hành nào đang hoạt động (`status = 'available'`) hay không.
    2.  Nếu tour bắt buộc phải chọn đợt đi nhưng `scheduleId` gửi lên bị trống, throw `BadRequestException`.
    3.  Cập nhật hàm `cancelRequest` để ghi nhận giao dịch hoàn tiền với số tiền dương (tránh lỗi constraint) và gán nhãn `refund_pending`.

#### [MODIFY] [admin.controller.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/admin/admin.controller.ts) & [admin.service.ts](file:///Users/twot/Documents/CODE/DACS_TravelConnect_VN/TravelConnectVN/backend/src/admin/admin.service.ts)
*   Thêm các API quản lý và phê duyệt yêu cầu hoàn tiền dành cho Admin:
    *   `GET /admin/refunds/pending`: Lấy danh sách các giao dịch đang chờ hoàn tiền.
    *   `POST /admin/refunds/:id/process`: Phê duyệt hoàn tiền (đổi trạng thái giao dịch sang `refunded` và tour request sang `refunded` hoặc `cancelled_by_user`).

---

## 2. Chi tiết thực hiện (Detailed Implementation Plan)

### Bước 1: Sửa lỗi logic quyết toán nợ nhóm (`trip-expenses.service.ts`)
Chúng ta sẽ thay thế logic thô sơ của hàm `settleDebts` bằng giải pháp quyết toán dựa trên số dư thực tế.

```typescript
// Trong backend/src/trip-expenses/trip-expenses.service.ts

async settleDebts(
  userId: string,
  postId: string,
  data: SettleExpenseDto,
): Promise<ApiResponse<any>> {
  await this.validateAccess(userId, postId);

  // 1. Lấy dữ liệu expenses để tính toán netBalance thực tế giống getExpenses
  const expenses = await this.prisma.trip_expenses.findMany({
    where: { post_id: postId },
    include: { splits: true },
  });

  const post = await this.prisma.companion_posts.findUnique({
    where: { id: postId },
    include: {
      companion_requests: { where: { status: 'approved' } },
    },
  });

  if (!post) throw new NotFoundException('Không tìm thấy bài đăng');

  const allMemberIds = [post.user_id, ...post.companion_requests.map((r) => r.user_id)];

  const memberBalances = allMemberIds.map((memberId) => {
    const pendingPaid = expenses.reduce((sum, expense) => {
      if (expense.paid_by_user_id !== memberId) return sum;
      return sum + expense.splits.filter((s) => s.status === 'pending').reduce((sSum, s) => sSum + Number(s.amount), 0);
    }, 0);

    const pendingShare = expenses.reduce((sum, expense) => {
      const myPendingSplit = expense.splits.find((s) => s.user_id === memberId && s.status === 'pending');
      return sum + (myPendingSplit ? Number(myPendingSplit.amount) : 0);
    }, 0);

    return {
      userId: memberId,
      netBalance: pendingPaid - pendingShare,
    };
  });

  // 2. Chạy thuật toán Greedy để tìm settlement tương ứng giữa debtorId và creditorId
  const creditors = memberBalances.filter((m) => m.netBalance > 0.01).map((m) => ({ ...m }));
  const debtors = memberBalances.filter((m) => m.netBalance < -0.01).map((m) => ({ ...m, netBalance: Math.abs(m.netBalance) }));

  let settleAmount = 0;
  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];
    const amount = Math.min(creditor.netBalance, debtor.netBalance);

    if (debtor.userId === data.debtorId && creditor.userId === data.creditorId) {
      settleAmount = Math.round(amount);
      break;
    }

    creditor.netBalance -= amount;
    debtor.netBalance -= amount;
    if (creditor.netBalance <= 0.01) cIdx++;
    if (debtor.netBalance <= 0.01) dIdx++;
  }

  if (settleAmount <= 0) {
    throw new BadRequestException('Không tìm thấy khoản nợ hợp lệ cần quyết toán giữa hai thành viên này');
  }

  // 3. Thực hiện khấu trừ công nợ trong Database Transaction
  await this.prisma.$transaction(async (tx) => {
    // A. Trừ dần nợ của debtorId (pending splits của debtorId trong chuyến đi)
    const debtorSplits = await tx.trip_expense_splits.findMany({
      where: {
        user_id: data.debtorId,
        status: 'pending',
        expense: { post_id: postId },
      },
      include: { expense: true },
      orderBy: [{ expense: { expense_date: 'asc' } }],
    });

    let remainingDebtorAmount = settleAmount;
    for (const split of debtorSplits) {
      if (remainingDebtorAmount <= 0) break;

      const splitAmount = Number(split.amount);
      if (splitAmount <= remainingDebtorAmount) {
        // Settle toàn bộ split này
        await tx.trip_expense_splits.update({
          where: { expense_id_user_id: { expense_id: split.expense_id, user_id: split.user_id } },
          data: { status: 'settled', settled_at: new Date() },
        });
        remainingDebtorAmount -= splitAmount;
      } else {
        // Chia nhỏ split này ra
        await tx.trip_expense_splits.update({
          where: { expense_id_user_id: { expense_id: split.expense_id, user_id: split.user_id } },
          data: { amount: splitAmount - remainingDebtorAmount },
        });
        await tx.trip_expense_splits.create({
          data: {
            expense_id: split.expense_id,
            user_id: split.user_id,
            amount: remainingDebtorAmount,
            status: 'settled',
            settled_at: new Date(),
          },
        });
        remainingDebtorAmount = 0;
      }
    }

    // B. Trừ dần có của creditorId (tất cả pending splits của người khác thuộc hóa đơn do creditorId trả tiền)
    const creditorSplits = await tx.trip_expense_splits.findMany({
      where: {
        status: 'pending',
        expense: {
          post_id: postId,
          paid_by_user_id: data.creditorId,
        },
      },
      include: { expense: true },
      orderBy: [{ expense: { expense_date: 'asc' } }],
    });

    let remainingCreditorAmount = settleAmount;
    for (const split of creditorSplits) {
      if (remainingCreditorAmount <= 0) break;

      const splitAmount = Number(split.amount);
      if (splitAmount <= remainingCreditorAmount) {
        await tx.trip_expense_splits.update({
          where: { expense_id_user_id: { expense_id: split.expense_id, user_id: split.user_id } },
          data: { status: 'settled', settled_at: new Date() },
        });
        remainingCreditorAmount -= splitAmount;
      } else {
        await tx.trip_expense_splits.update({
          where: { expense_id_user_id: { expense_id: split.expense_id, user_id: split.user_id } },
          data: { amount: splitAmount - remainingCreditorAmount },
        });
        await tx.trip_expense_splits.create({
          data: {
            expense_id: split.expense_id,
            user_id: split.user_id,
            amount: remainingCreditorAmount,
            status: 'settled',
            settled_at: new Date(),
          },
        });
        remainingCreditorAmount = 0;
      }
    }
  });

  return {
    success: true,
    message: `Quyết toán thành công số tiền ${settleAmount.toLocaleString()} đ`,
  };
}
```

### Bước 2: Ràng buộc đặt tour theo đợt/lịch khởi hành (`tour-requests.service.ts`)
Bổ sung kiểm tra lịch trình khởi hành bắt buộc trong `createRequest`.

```typescript
// Trong backend/src/tour-requests/tour-requests.service.ts -> createRequest()

// 1. Kiểm tra tour tồn tại... (giữ nguyên)

// Bổ sung: Kiểm tra xem tour này có lịch trình nào đang khả dụng hay không
const activeSchedulesCount = await this.prisma.tour_schedules.count({
  where: {
    tour_id: tourId,
    status: 'available',
  },
});

if (activeSchedulesCount > 0 && !scheduleId) {
  throw new BadRequestException(
    'Tour này yêu cầu bạn phải lựa chọn lịch khởi hành cụ thể.',
  );
}
```

### Bước 3: Sửa lỗi hoàn tiền số tiền âm
Cập nhật cách tạo giao dịch hoàn tiền thành số tiền dương (để tránh CHECK constraint lỗi) trong `cancelRequest`.

```typescript
// Trong backend/src/tour-requests/tour-requests.service.ts -> cancelRequest()

// Thay vì lưu số tiền âm:
amount: -refundAmount

// Chúng ta sẽ lưu số tiền dương:
amount: refundAmount
```

### Bước 4: Viết API Quản lý Hoàn tiền cho Admin (`admin.service.ts` & `admin.controller.ts`)

Bổ sung API lấy danh sách hoàn tiền đang chờ và thực hiện duyệt hoàn tiền.

```typescript
// Trong backend/src/admin/admin.service.ts

async getPendingRefunds() {
  return this.prisma.payment_transactions.findMany({
    where: { status: 'refund_pending' },
    include: {
      users: { select: { id: true, full_name: true, email: true } },
      tour_requests: { include: { tours: true } },
    },
    orderBy: { created_at: 'desc' },
  });
}

async processRefund(transactionId: string, action: 'approve' | 'reject', note?: string) {
  const transaction = await this.prisma.payment_transactions.findUnique({
    where: { id: transactionId },
    include: { tour_requests: true },
  });

  if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');
  if (transaction.status !== 'refund_pending') {
    throw new BadRequestException('Giao dịch không nằm trong trạng thái chờ hoàn tiền');
  }

  const nextStatus = action === 'approve' ? 'refunded' : 'refund_rejected';

  await this.prisma.$transaction([
    this.prisma.payment_transactions.update({
      where: { id: transactionId },
      data: {
        status: nextStatus,
        gateway_response: { admin_note: note || 'Processed by Admin' },
      },
    }),
    this.prisma.tour_requests.update({
      where: { id: transaction.tour_request_id },
      data: {
        status: action === 'approve' ? 'cancelled_by_user' : 'paid',
        cancellation_note: action === 'approve' ? `Đã hoàn trả tiền thành công` : `Từ chối hoàn tiền: ${note}`,
      },
    }),
  ]);

  return { success: true, message: action === 'approve' ? 'Đã hoàn tiền thành công' : 'Đã từ chối hoàn tiền' };
}
```

```typescript
// Trong backend/src/admin/admin.controller.ts

@Get('refunds/pending')
@UseGuards(RolesGuard)
@Roles('admin')
async getPendingRefunds() {
  return this.adminService.getPendingRefunds();
}

@Post('refunds/:id/process')
@UseGuards(RolesGuard)
@Roles('admin')
async processRefund(
  @Param('id') id: string,
  @Body() body: { action: 'approve' | 'reject'; note?: string },
) {
  return this.adminService.processRefund(id, body.action, body.note);
}
```

---

## 3. Kế hoạch xác minh (Verification Plan)

### Kiểm thử tự động / API Manual
1.  **Test Quyết toán nợ nhóm**:
    *   Tạo 1 Companion Post, phê duyệt 2 thành viên B và C tham gia.
    *   B thêm chi tiêu 300k (B trả cho cả nhóm gồm Host, B, C => mỗi người chịu 100k).
    *   C thêm chi tiêu 300k (C trả cho cả nhóm => mỗi người chịu 100k).
    *   Lấy danh sách chi tiêu, kiểm tra đề xuất (Greedy): "Host trả B 100k" và "Host trả C 100k".
    *   Click Quyết toán "Host trả B 100k" => Kiểm tra dữ liệu DB xem split của Host dưới hóa đơn của B đã chuyển thành `settled` chưa.
2.  **Test Tour Schedule Validation**:
    *   Tạo Tour có lịch trình.
    *   Gửi request đặt tour mà không gửi kèm `scheduleId` => Phải nhận về lỗi HTTP 400.
3.  **Test Admin Refund API**:
    *   Gửi lệnh hủy tour đã thanh toán => Kiểm tra xem có bản ghi transaction positive với status `refund_pending` không.
    *   Đăng nhập tài khoản Admin, gọi API `GET /admin/refunds/pending` để thấy giao dịch.
    *   Gọi API `POST /admin/refunds/:id/process` với payload `{ action: "approve" }` và kiểm tra trạng thái chuyển đổi thành công.
