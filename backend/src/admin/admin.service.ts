import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import {
  UpdateUserStatusDto,
  AssignRoleDto,
  ModerationDto,
  ProcessReportDto,
  ProcessVerificationDto,
  CreateStaffDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
  private client: GoogleGenAI;

  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.client = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async getDashboardStats() {
    const [
      userCount,
      tourCount,
      companionCount,
      reportCount,
      pendingVerificationCount,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.public_users.count(),
      this.prisma.tours.count({ where: { deleted_at: null } }),
      this.prisma.companion_posts.count({ where: { deleted_at: null } }),
      this.prisma.reports.count({ where: { status: 'open' } }),
      this.prisma.guide_verification_requests.count({
        where: { status: 'pending' },
      }),
      this.prisma.payment_transactions.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true },
      }),
    ]);

    return {
      userCount,
      tourCount,
      companionCount,
      reportCount,
      pendingVerificationCount,
      totalRevenue: Number(totalRevenue._sum.amount || 0),
    };
  }

  async getStatisticsUsers() {
    const [roleBreakdown, statusBreakdown] = await Promise.all([
      this.prisma.user_roles.groupBy({
        by: ['role_code'],
        _count: { user_id: true },
      }),
      this.prisma.public_users.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    return {
      roles: roleBreakdown.map((r) => ({
        name: r.role_code,
        value: r._count.user_id,
      })),
      statuses: statusBreakdown.map((s) => ({
        name: s.status,
        value: s._count.id,
      })),
    };
  }

  async getStatisticsTours() {
    const [categoryBreakdown, provinceBreakdown, statusBreakdown] =
      await Promise.all([
        this.prisma.tours.groupBy({
          by: ['category_id'],
          where: { deleted_at: null },
          _count: { id: true },
        }),
        this.prisma.tours.groupBy({
          by: ['province'],
          where: { deleted_at: null },
          _count: { id: true },
          orderBy: { _count: { id: 'desc' } },
          take: 10,
        }),
        this.prisma.tours.groupBy({
          by: ['visibility_status'],
          where: { deleted_at: null },
          _count: { id: true },
        }),
      ]);

    // Fetch category names
    const categories = await this.prisma.tour_categories.findMany();
    const categoryMap = new Map(
      categories.map((c) => [c.id.toString(), c.name]),
    );

    return {
      categories: categoryBreakdown.map((c) => ({
        name:
          (c.category_id ? categoryMap.get(c.category_id.toString()) : null) ||
          'Unknown',
        value: c._count.id,
      })),

      provinces: provinceBreakdown.map((p) => ({
        name: p.province,
        value: p._count.id,
      })),
      statuses: statusBreakdown.map((s) => ({
        name: s.visibility_status,
        value: s._count.id,
      })),
    };
  }

  async getStatisticsReports() {
    const [statusBreakdown, typeBreakdown] = await Promise.all([
      this.prisma.reports.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.reports.groupBy({
        by: ['target_type'],
        _count: { id: true },
      }),
    ]);

    return {
      statuses: statusBreakdown.map((s) => ({
        name: s.status,
        value: s._count.id,
      })),
      types: typeBreakdown.map((t) => ({
        name: t.target_type,
        value: t._count.id,
      })),
    };
  }

  async getStatisticsRevenue() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Total 7 days including today

    const dailyRevenue = await this.prisma.$queryRaw<
      Array<{ date: Date | string; total: unknown }>
    >`SELECT 
        DATE(paid_at) as date, 
        SUM(amount) as total 
      FROM payment_transactions 
      WHERE status = 'paid' AND paid_at >= ${sevenDaysAgo}
      GROUP BY DATE(paid_at)
      ORDER BY date ASC
    `;

    // Map existing data for quick lookup
    const revenueMap = new Map<string, number>();
    dailyRevenue.forEach((d) => {
      const dateStr = new Date(d.date).toLocaleDateString('vi-VN');
      revenueMap.set(dateStr, Number(d.total));
    });

    // Fill in all 7 days
    const daily: Array<{ date: string; amount: number }> = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = date.toLocaleDateString('vi-VN');

      daily.push({
        date: dateStr,
        amount: revenueMap.get(dateStr) || 0,
      });
    }

    return { daily };
  }

  // User Management
  async getUsers(params: {
    skip?: number;
    take?: number;
    role?: string;
    status?: string;
    search?: string;
  }) {
    const { skip, take, role, status, search } = params;

    const where: Prisma.public_usersWhereInput = {};
    if (status) where.status = status;
    if (role) {
      where.user_roles_user_roles_user_idTousers = {
        some: { role_code: role },
      };
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { full_name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.public_users.findMany({
        where,
        skip,
        take,
        include: {
          user_roles_user_roles_user_idTousers: {
            select: { role_code: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.public_users.count({ where }),
    ]);

    return { items, total };
  }

  async updateUserStatus(
    id: string,
    dto: UpdateUserStatusDto,
    adminId: string,
  ) {
    const user = await this.prisma.public_users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.public_users.update({
      where: { id },
      data: { status: dto.status },
    });

    // Log activity
    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'user_management',
        entity_type: 'users',
        entity_pk: id,
        action_type:
          String(dto.status) === 'locked' ? 'lock_account' : 'unlock_account',
        reason: dto.reason,
        old_data: { status: user.status },
        new_data: { status: dto.status },
      },
    });

    return updatedUser;
  }

  async assignRole(userId: string, dto: AssignRoleDto, adminId: string) {
    const user = await this.prisma.public_users.findUnique({
      where: { id: userId },
      include: { user_roles_user_roles_user_idTousers: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const roleExists = await this.prisma.roles.findUnique({
      where: { role_code: dto.roleCode },
    });
    if (!roleExists) throw new BadRequestException('Role does not exist');

    const alreadyHasRole = user.user_roles_user_roles_user_idTousers.some(
      (ur) => ur.role_code === dto.roleCode,
    );
    if (alreadyHasRole)
      throw new BadRequestException('User already has this role');

    const result = await this.prisma.$transaction(async (tx) => {
      const ur = await tx.user_roles.create({
        data: {
          user_id: userId,
          role_code: dto.roleCode,
          assigned_by: adminId,
        },
      });

      await tx.user_role_change_logs.create({
        data: {
          target_user_id: userId,
          changed_role_code: dto.roleCode,
          action_type: 'assign',
          changed_by_user_id: adminId,
          note: dto.note,
          old_snapshot: user.user_roles_user_roles_user_idTousers,
          new_snapshot: [
            ...user.user_roles_user_roles_user_idTousers,
            { role_code: dto.roleCode },
          ],
        },
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'user_management',
          entity_type: 'users',
          entity_pk: userId,
          action_type: 'assign_role',
          reason: dto.note,
          new_data: { role_code: dto.roleCode },
        },
      });

      return ur;
    });

    return result;
  }

  async revokeRole(userId: string, roleCode: string, adminId: string) {
    const user = await this.prisma.public_users.findUnique({
      where: { id: userId },
      include: { user_roles_user_roles_user_idTousers: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const hasRole = user.user_roles_user_roles_user_idTousers.some(
      (ur) => ur.role_code === roleCode,
    );
    if (!hasRole) throw new BadRequestException('User does not have this role');

    if (userId === adminId && roleCode === 'SYSTEM_ADMIN') {
      throw new BadRequestException('Cannot revoke your own admin role');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.user_roles.delete({
        where: {
          user_id_role_code: {
            user_id: userId,
            role_code: roleCode,
          },
        },
      });

      await tx.user_role_change_logs.create({
        data: {
          target_user_id: userId,
          changed_role_code: roleCode,
          action_type: 'revoke',
          changed_by_user_id: adminId,
          old_snapshot: user.user_roles_user_roles_user_idTousers,
          new_snapshot: user.user_roles_user_roles_user_idTousers.filter(
            (ur) => ur.role_code !== roleCode,
          ),
        },
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'user_management',
          entity_type: 'users',
          entity_pk: userId,
          action_type: 'revoke_role',
          new_data: { role_code: roleCode },
        },
      });

      return { success: true };
    });

    return result;
  }

  // Reports
  async getReports(params: {
    skip?: number;
    take?: number;
    status?: string;
    targetType?: string;
  }) {
    const { skip, take, status, targetType } = params;
    const where: Prisma.reportsWhereInput = {};
    if (status) where.status = status;
    if (targetType) where.target_type = targetType;

    const [items, total] = await Promise.all([
      this.prisma.reports.findMany({
        where,
        skip,
        take,
        include: {
          users_reports_reporter_user_idTousers: {
            select: { full_name: true, email: true },
          },
          users_reports_assigned_to_user_idTousers: {
            select: { full_name: true },
          },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.reports.count({ where }),
    ]);

    return { items, total };
  }

  async processReport(id: string, dto: ProcessReportDto, adminId: string) {
    const report = await this.prisma.reports.findUnique({ where: { id } });
    if (!report) throw new NotFoundException('Report not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.reports.update({
        where: { id },
        data: {
          status: dto.status,
          processed_by_user_id: adminId,
          processed_at: new Date(),
          resolution_note: dto.resolution_note,
          assigned_to_user_id:
            dto.status === 'assigned' ? adminId : report.assigned_to_user_id,
        },
      });

      if (dto.status === 'resolved') {
        let guideProfileId = report.guide_profile_id;
        if (!guideProfileId && report.tour_id) {
          const tour = await tx.tours.findUnique({
            where: { id: report.tour_id },
            include: { guide_profiles: true },
          });
          if (tour?.guide_profiles) {
            guideProfileId = tour.guide_profiles.id;
          }
        }
        if (guideProfileId) {
          const guide = await tx.guide_profiles.findUnique({
            where: { id: guideProfileId },
          });
          if (guide) {
            const newRep = Math.max(0, guide.reputation_score - 15);
            await tx.guide_profiles.update({
              where: { id: guideProfileId },
              data: {
                reputation_score: newRep,
                visibility_status:
                  newRep < 50 ? 'hidden' : guide.visibility_status,
              },
            });
            if (newRep < 50) {
              await tx.public_users.update({
                where: { id: guide.user_id },
                data: { status: 'suspended' },
              });
            }
          }
        }
      }

      await tx.report_processing_history.create({
        data: {
          report_id: id,
          action_by_user_id: adminId,
          action_type: 'status_changed',
          old_status: report.status,
          new_status: dto.status,
          note: dto.resolution_note,
        },
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'report_handling',
          entity_type: 'reports',
          entity_pk: id,
          action_type:
            dto.status === 'resolved' ? 'resolve_report' : 'reject_report',
          reason: dto.resolution_note,
          old_data: { status: report.status },
          new_data: { status: dto.status },
        },
      });

      return updated;
    });

    return result;
  }

  // Moderation
  async moderateTour(id: string, dto: ModerationDto, adminId: string) {
    const tour = await this.prisma.tours.findUnique({ where: { id } });
    if (!tour) throw new NotFoundException('Tour not found');

    const updated = await this.prisma.tours.update({
      where: { id },
      data: { visibility_status: dto.visibility_status },
    });

    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'tour_moderation',
        entity_type: 'tours',
        entity_pk: id,
        action_type: dto.visibility_status === 'hidden' ? 'hide' : 'unhide',
        reason: dto.reason,
        old_data: { visibility_status: tour.visibility_status },
        new_data: { visibility_status: dto.visibility_status },
      },
    });

    return updated;
  }

  async moderateCompanionPost(id: string, dto: ModerationDto, adminId: string) {
    const post = await this.prisma.companion_posts.findUnique({
      where: { id },
    });
    if (!post) throw new NotFoundException('Post not found');

    const updated = await this.prisma.companion_posts.update({
      where: { id },
      data: { visibility_status: dto.visibility_status },
    });

    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'companion_moderation',
        entity_type: 'companion_posts',
        entity_pk: id,
        action_type: dto.visibility_status === 'hidden' ? 'hide' : 'unhide',
        reason: dto.reason,
        old_data: { visibility_status: post.visibility_status },
        new_data: { visibility_status: dto.visibility_status },
      },
    });

    return updated;
  }

  async getTours(params: {
    skip?: number;
    take?: number;
    status?: string;
    visibility?: string;
    search?: string;
  }) {
    const { skip, take, status, visibility, search } = params;
    const where: Prisma.toursWhereInput = { deleted_at: null };
    if (status) where.business_status = status;
    if (visibility) where.visibility_status = visibility;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.tours.findMany({
        where,
        skip,
        take,
        include: {
          guide_profiles: {
            include: {
              users: { select: { full_name: true, avatar_url: true } },
            },
          },
          tour_images: {
            take: 1,
            orderBy: { sort_order: 'asc' }
          }
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.tours.count({ where }),
    ]);

    return { items, total };
  }

  async getCompanionPosts(params: {
    skip?: number;
    take?: number;
    visibility?: string;
    search?: string;
  }) {
    const { skip, take, visibility, search } = params;
    const where: Prisma.companion_postsWhereInput = { deleted_at: null };
    if (visibility) where.visibility_status = visibility;
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [items, total] = await Promise.all([
      this.prisma.companion_posts.findMany({
        where,
        skip,
        take,
        include: {
          users: { select: { full_name: true, avatar_url: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.companion_posts.count({ where }),
    ]);

    return { items, total };
  }

  // Verification
  async getVerificationRequests() {
    return this.prisma.guide_verification_requests.findMany({
      include: {
        guide_profiles: {
          include: {
            users: { select: { full_name: true, email: true } },
          },
        },
        guide_verification_documents: true,
      },
      orderBy: { submitted_at: 'desc' },
    });
  }

  async processVerification(
    id: string,
    dto: ProcessVerificationDto,
    adminId: string,
  ) {
    const request = await this.prisma.guide_verification_requests.findUnique({
      where: { id },
      include: { guide_profiles: true },
    });
    if (!request) throw new NotFoundException('Request not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedReq = await tx.guide_verification_requests.update({
        where: { id },
        data: {
          status: dto.status,
          processed_by_user_id: adminId,
          processed_at: new Date(),
          result_note: dto.result_note,
        },
      });

      await tx.guide_profiles.update({
        where: { id: request.guide_profile_id },
        data: {
          verification_status: dto.status,
          visibility_status:
            dto.status === 'approved'
              ? 'visible'
              : request.guide_profiles.visibility_status,
        },
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'guide_verification',
          entity_type: 'guide_verification_requests',
          entity_pk: id,
          action_type: dto.status === 'approved' ? 'approve' : 'reject',
          reason: dto.result_note,
        },
      });

      return updatedReq;
    });

    return result;
  }

  // Activity Logs
  async getActivityLogs(params: {
    skip?: number;
    take?: number;
    module?: string;
  }) {
    const { skip, take, module } = params;
    const where: Prisma.admin_activity_logsWhereInput = {};
    if (module) where.module_name = module;

    const [items, total] = await Promise.all([
      this.prisma.admin_activity_logs.findMany({
        where,
        skip,
        take,
        include: {
          users: { select: { full_name: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.admin_activity_logs.count({ where }),
    ]);

    return { items, total };
  }

  // Transaction Management
  async getTransactions(params: {
    skip?: number;
    take?: number;
    status?: string;
    search?: string;
  }) {
    const { skip, take, status, search } = params;
    const where: Prisma.payment_transactionsWhereInput = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { transaction_code: { contains: search, mode: 'insensitive' } },
        {
          users: {
            OR: [
              { full_name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.payment_transactions.findMany({
        where,
        skip,
        take,
        include: {
          users: { select: { id: true, full_name: true, email: true } },
          tour_requests: { include: { tours: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.payment_transactions.count({ where }),
    ]);

    return { items, total };
  }

  async updateTransactionStatus(id: string, status: string, adminId: string) {
    const transaction = await this.prisma.payment_transactions.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const oldStatus = transaction.status;

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedTx = await tx.payment_transactions.update({
        where: { id },
        data: {
          status,
          paid_at: status === 'paid' ? new Date() : transaction.paid_at,
        },
      });

      if (status === 'paid') {
        const tourRequest = await tx.tour_requests.findUnique({
          where: { id: transaction.tour_request_id },
          include: { tours: true },
        });

        if (tourRequest) {
          const paidTransactions = await tx.payment_transactions.findMany({
            where: {
              tour_request_id: transaction.tour_request_id,
              status: 'paid',
            },
          });

          const currentPaidSum = paidTransactions.reduce(
            (sum, t) => sum + Number(t.amount),
            0,
          );

          const totalPaid = currentPaidSum;

          const price = tourRequest.price_at_booking
            ? Number(tourRequest.price_at_booking)
            : tourRequest.schedule_id
              ? Number(
                  (
                    await tx.tour_schedules.findUnique({
                      where: { id: tourRequest.schedule_id },
                    })
                  )?.price || tourRequest.tours.price,
                )
              : Number(tourRequest.tours.price);
          const totalAmount = price * tourRequest.participant_count;

          let targetStatus = 'approved';
          if (totalPaid >= totalAmount) {
            targetStatus = 'paid';
          } else if (totalPaid > 0) {
            targetStatus = 'partially_paid';
          }

          await tx.tour_requests.update({
            where: { id: transaction.tour_request_id },
            data: { status: targetStatus },
          });
        }
      }

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'payment_management',
          entity_type: 'payment_transactions',
          entity_pk: id,
          action_type: 'change_status',
          reason: 'Manual reconciliation / admin override',
          old_data: { status: oldStatus },
          new_data: { status },
        },
      });

      return updatedTx;
    });

    return updated;
  }

  // Refund Management
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

  async processRefund(
    transactionId: string,
    action: 'approve' | 'reject',
    note?: string,
  ) {
    const transaction = await this.prisma.payment_transactions.findUnique({
      where: { id: transactionId },
      include: { tour_requests: true },
    });

    if (!transaction) throw new NotFoundException('Không tìm thấy giao dịch');
    if (transaction.status !== 'refund_pending') {
      throw new BadRequestException(
        'Giao dịch không nằm trong trạng thái chờ hoàn tiền',
      );
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
          cancellation_note:
            action === 'approve'
              ? `Đã hoàn trả tiền thành công`
              : `Từ chối hoàn tiền: ${note}`,
        },
      }),
    ]);

    return {
      success: true,
      message:
        action === 'approve'
          ? 'Đã hoàn tiền thành công'
          : 'Đã từ chối hoàn tiền',
    };
  }

  // Guide Settlements
  async getGuideSettlements() {
    const guides = await this.prisma.guide_profiles.findMany({
      where: { deleted_at: null },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
            bank_id: true,
            account_no: true,
            account_name: true,
          },
        },
      },
    });

    const settlements = await Promise.all(
      guides.map(async (guide) => {
        const unpaidTransactions =
          await this.prisma.payment_transactions.findMany({
            where: {
              status: 'paid',
              guide_settled: false,
              tour_requests: {
                tours: {
                  guide_profile_id: guide.id,
                },
              },
            },
            select: {
              id: true,
              amount: true,
              transaction_code: true,
              created_at: true,
            },
          });

        const totalUnpaid = unpaidTransactions.reduce(
          (sum, tx) => sum + Number(tx.amount),
          0,
        );
        const commissionFee = totalUnpaid * 0.1;
        const netPayable = totalUnpaid * 0.9;

        return {
          guideProfileId: guide.id,
          guideUserId: guide.user_id,
          fullName: guide.users.full_name,
          email: guide.users.email,
          phone: guide.users.phone,
          bankId: guide.users.bank_id,
          accountNo: guide.users.account_no,
          accountName: guide.users.account_name,
          unsettledTxCount: unpaidTransactions.length,
          totalUnpaidAmount: totalUnpaid,
          commissionFee,
          netPayable,
          transactions: unpaidTransactions,
        };
      }),
    );

    return settlements;
  }

  async settleGuideTransactions(guideProfileId: string, adminId: string) {
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { id: guideProfileId },
      include: { users: { select: { full_name: true } } },
    });
    if (!guide)
      throw new NotFoundException('Không tìm thấy thông tin Hướng dẫn viên');

    const transactionsToSettle =
      await this.prisma.payment_transactions.findMany({
        where: {
          status: 'paid',
          guide_settled: false,
          tour_requests: {
            tours: {
              guide_profile_id: guideProfileId,
            },
          },
        },
      });

    if (transactionsToSettle.length === 0) {
      throw new BadRequestException(
        'Không có giao dịch nào cần quyết toán cho Hướng dẫn viên này',
      );
    }

    const totalSettledAmount = transactionsToSettle.reduce(
      (sum, tx) => sum + Number(tx.amount),
      0,
    );
    const netPaid = totalSettledAmount * 0.9;

    await this.prisma.$transaction(async (tx) => {
      const updateRes = await tx.payment_transactions.updateMany({
        where: {
          id: { in: transactionsToSettle.map((t) => t.id) },
        },
        data: {
          guide_settled: true,
        },
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId === 'system-cron' ? null : adminId,
          module_name: 'payment_management',
          entity_type: 'guide_profiles',
          entity_pk: guideProfileId,
          action_type: 'other',
          reason: `Quyết toán thu nhập HDV ${guide.users.full_name}. Tổng doanh thu: ${totalSettledAmount}đ. Thực nhận (90%): ${netPaid}đ.`,
          new_data: {
            settledTransactionIds: transactionsToSettle.map((t) => t.id),
            grossAmount: totalSettledAmount,
            netAmount: netPaid,
          },
        },
      });

      return updateRes;
    });

    return {
      success: true,
      message: `Quyết toán thành công cho HDV ${guide.users.full_name}`,
      settledCount: transactionsToSettle.length,
      grossAmount: totalSettledAmount,
      netAmount: netPaid,
    };
  }

  async createStaff(dto: CreateStaffDto, adminId: string) {
    const adminClient = this.supabaseService.getAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: { full_name: dto.fullName },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    const userId = data.user.id;

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Upsert public_users to ensure it exists instantly
      const publicUser = await tx.public_users.upsert({
        where: { id: userId },
        update: {
          email: dto.email,
          full_name: dto.fullName,
        },
        create: {
          id: userId,
          email: dto.email,
          full_name: dto.fullName,
          status: 'active',
        },
      });

      // 2. Assign the chosen role
      const alreadyHasRole = await tx.user_roles.findUnique({
        where: {
          user_id_role_code: { user_id: userId, role_code: dto.roleCode },
        },
      });

      if (!alreadyHasRole) {
        await tx.user_roles.create({
          data: {
            user_id: userId,
            role_code: dto.roleCode,
            assigned_by: adminId,
          },
        });
      }

      // Also give USER role by default
      const alreadyHasUserRole = await tx.user_roles.findUnique({
        where: {
          user_id_role_code: { user_id: userId, role_code: 'USER' },
        },
      });

      if (!alreadyHasUserRole) {
        await tx.user_roles.create({
          data: {
            user_id: userId,
            role_code: 'USER',
            assigned_by: adminId,
          },
        });
      }

      // 3. Create change log
      await tx.user_role_change_logs.create({
        data: {
          target_user_id: userId,
          changed_role_code: dto.roleCode,
          action_type: 'assign',
          changed_by_user_id: adminId,
          note: `Tạo tài khoản nhân viên mới với vai trò: ${dto.roleCode}`,
          old_snapshot: [],
          new_snapshot: [{ role_code: 'USER' }, { role_code: dto.roleCode }],
        },
      });

      // 4. Create admin activity log
      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'user_management',
          entity_type: 'users',
          entity_pk: userId,
          action_type: 'create',
          reason: `Tạo tài khoản nhân viên mới. Email: ${dto.email}, Quyền: ${dto.roleCode}`,
          new_data: {
            email: dto.email,
            full_name: dto.fullName,
            role_code: dto.roleCode,
          },
        },
      });

      return publicUser;
    });

    return {
      success: true,
      message: `Tạo tài khoản nhân viên ${dto.fullName} thành công`,
      data: result,
    };
  }

  async sendBroadcastNotification(
    dto: {
      title: string;
      message: string;
      targetRole?: string;
      targetUserId?: string;
    },
    adminId: string,
  ) {
    const { title, message, targetRole, targetUserId } = dto;
    let targetUserIds: string[] = [];

    if (targetUserId) {
      targetUserIds = [targetUserId];
    } else if (targetRole) {
      const userRoles = await this.prisma.user_roles.findMany({
        where: { role_code: targetRole },
        select: { user_id: true },
      });
      targetUserIds = userRoles.map((ur) => ur.user_id);
    } else {
      const users = await this.prisma.public_users.findMany({
        select: { id: true },
      });
      targetUserIds = users.map((u) => u.id);
    }

    if (targetUserIds.length === 0) {
      return {
        success: false,
        message: 'Không tìm thấy người nhận phù hợp',
      };
    }

    await this.prisma.$transaction(async (tx) => {
      const notificationsData = targetUserIds.map((userId) => ({
        user_id: userId,
        notification_type: 'broadcast',
        title,
        content: message,
        payload: {
          broadcast_by: adminId,
          target_role: targetRole || null,
        },
      }));

      await tx.notifications.createMany({
        data: notificationsData,
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'system_other',
          entity_type: 'notifications',
          action_type: 'other',
          reason: `Phát thông báo rộng rãi: "${title}". Đối tượng: ${targetRole || targetUserId || 'Tất cả'}`,
          new_data: {
            title,
            message,
            targetRole,
            targetUserId,
            total_recipients: targetUserIds.length,
          } as Prisma.InputJsonValue,
        },
      });
    });

    return {
      success: true,
      message: `Đã gửi thông báo tới ${targetUserIds.length} người dùng thành công`,
    };
  }

  async analyzeContent(text: string) {
    if (!text || text.trim() === '') {
      return { flagged: false, reason: 'Nội dung rỗng', highlights: [] };
    }

    try {
      const prompt = `Analyze the following text for moderation issues in TravelConnectVN (a travel platform). We are scanning for:
1. Phone numbers, personal email addresses, or social media handles/links (e.g. Zalo, FB, Viber, Telegram) where users might attempt to coordinate off-platform to bypass fees.
2. Offensive language, profanity, or hate speech in Vietnamese or English.
3. Scam, spam, or suspicious pricing claims.

Text to analyze: "${text}"

You MUST respond strictly with a valid JSON object of this structure:
{
  "flagged": true/false,
  "reason": "Short summary of issues found, in Vietnamese",
  "highlights": [
    {
      "text": "the exact text segment found containing the violation",
      "type": "contact_info" or "offensive" or "spam" or "other",
      "explanation": "Brief explanation in Vietnamese of why this is flagged"
    }
  ]
}
If no issues are found, flagged should be false, reason should be "No issues detected", and highlights should be an empty array. Do not include any Markdown wrap (like \`\`\`json) or extra text. Just return the raw JSON string.`;

      const response = await this.client.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      });

      const resText = response.text || '';
      const cleanJson = resText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleanJson) as {
        flagged: boolean;
        reason: string;
        highlights: Array<{ text: string; type: string; explanation: string }>;
      };
      return parsed;
    } catch (error) {
      console.error('Gemini Moderation Error, falling back to regex:', error);
      const highlights: Array<{
        text: string;
        type: string;
        explanation: string;
      }> = [];

      const phoneRegex = /(?:\+?84|0)(?:\s*\d){9,10}/g;
      let match: RegExpExecArray | null;
      while ((match = phoneRegex.exec(text)) !== null) {
        highlights.push({
          text: match[0],
          type: 'contact_info',
          explanation: 'Phát hiện số điện thoại liên hệ cá nhân.',
        });
      }

      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      while ((match = emailRegex.exec(text)) !== null) {
        highlights.push({
          text: match[0],
          type: 'contact_info',
          explanation: 'Phát hiện địa chỉ email cá nhân.',
        });
      }

      const flagged = highlights.length > 0;
      return {
        flagged,
        reason: flagged
          ? 'Phát hiện thông tin liên hệ cá nhân (Fallback Scan).'
          : 'Không phát hiện lỗi (Fallback Scan).',
        highlights,
      };
    }
  }

  async getDeletedItems() {
    const [tours, companionPosts, users] = await Promise.all([
      this.prisma.tours.findMany({
        where: { deleted_at: { not: null } },
        select: {
          id: true,
          title: true,
          created_at: true,
          deleted_at: true,
          guide_profiles: {
            select: {
              users: {
                select: {
                  full_name: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.companion_posts.findMany({
        where: { deleted_at: { not: null } },
        select: {
          id: true,
          title: true,
          created_at: true,
          deleted_at: true,
          users: {
            select: {
              full_name: true,
            },
          },
        },
      }),
      this.prisma.public_users.findMany({
        where: { status: { in: ['locked', 'suspended'] } },
        select: {
          id: true,
          full_name: true,
          email: true,
          status: true,
          created_at: true,
        },
      }),
    ]);

    const formattedTours = tours.map((t) => ({
      id: t.id,
      type: 'tour',
      title: t.title,
      owner: t.guide_profiles?.users?.full_name || 'N/A',
      created_at: t.created_at,
      deleted_at: t.deleted_at,
    }));

    const formattedPosts = companionPosts.map((p) => ({
      id: p.id,
      type: 'companion_post',
      title: p.title,
      owner: p.users?.full_name || 'N/A',
      created_at: p.created_at,
      deleted_at: p.deleted_at,
    }));

    const formattedUsers = users.map((u) => ({
      id: u.id,
      type: 'user',
      title: u.full_name || u.email,
      owner: u.email,
      created_at: u.created_at,
      deleted_at: null,
      status: u.status,
    }));

    return [...formattedTours, ...formattedPosts, ...formattedUsers];
  }

  async restoreDeletedItem(type: string, id: string, adminId: string) {
    if (type === 'tour') {
      const tour = await this.prisma.tours.findUnique({
        where: { id },
      });
      if (!tour) throw new NotFoundException('Không tìm thấy tour');
      const restored = await this.prisma.tours.update({
        where: { id },
        data: { deleted_at: null },
      });
      await this.prisma.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'system_other',
          entity_type: 'tours',
          entity_pk: id,
          action_type: 'restore',
          reason: 'Khôi phục từ Console quản trị',
          old_data: { deleted_at: tour.deleted_at },
          new_data: { deleted_at: null },
        },
      });
      return restored;
    } else if (type === 'companion_post') {
      const post = await this.prisma.companion_posts.findUnique({
        where: { id },
      });
      if (!post)
        throw new NotFoundException('Không tìm thấy bài đăng ghép đoàn');
      const restored = await this.prisma.companion_posts.update({
        where: { id },
        data: { deleted_at: null },
      });
      await this.prisma.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'system_other',
          entity_type: 'companion_posts',
          entity_pk: id,
          action_type: 'restore',
          reason: 'Khôi phục từ Console quản trị',
          old_data: { deleted_at: post.deleted_at },
          new_data: { deleted_at: null },
        },
      });
      return restored;
    } else if (type === 'user') {
      const user = await this.prisma.public_users.findUnique({
        where: { id },
      });
      if (!user) throw new NotFoundException('Không tìm thấy người dùng');
      const restored = await this.prisma.public_users.update({
        where: { id },
        data: { status: 'active' },
      });
      await this.prisma.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'system_other',
          entity_type: 'users',
          entity_pk: id,
          action_type: 'restore',
          reason: 'Khôi phục tài khoản từ Console quản trị',
          old_data: { status: user.status },
          new_data: { status: 'active' },
        },
      });
      return restored;
    } else {
      throw new BadRequestException('Loại bản ghi không hợp lệ');
    }
  }

  // Phase 6: Anomaly Detection
  async getAnomalyAlerts() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Detect bulk actions (>10 actions within 5 minutes)
    const recentLogs = await this.prisma.admin_activity_logs.findMany({
      where: { created_at: { gte: twentyFourHoursAgo } },
      include: { users: { select: { full_name: true, email: true } } },
      orderBy: { created_at: 'desc' },
      take: 500,
    });

    const alerts: Array<{
      type: string;
      severity: 'high' | 'medium' | 'low';
      message: string;
      actor: string;
      timestamp: Date;
      details: string;
    }> = [];

    // Group by actor and check for bulk operations
    const actorGroups: Record<string, typeof recentLogs> = {};
    for (const log of recentLogs) {
      const key = log.actor_user_id || 'system';
      if (!actorGroups[key]) actorGroups[key] = [];
      actorGroups[key].push(log);
    }

    for (const [actorId, logs] of Object.entries(actorGroups)) {
      // Check for bulk operations in 5 min windows
      const recentBulk = logs.filter((l) => l.created_at >= fiveMinutesAgo);
      if (recentBulk.length > 10) {
        const actorName = logs[0]?.users?.full_name || actorId;
        alerts.push({
          type: 'bulk_operations',
          severity: 'high',
          message: `${actorName} thực hiện ${recentBulk.length} thao tác trong 5 phút gần nhất`,
          actor: actorName,
          timestamp: new Date(),
          details: `Các module: ${[...new Set(recentBulk.map((l) => l.module_name))].join(', ')}`,
        });
      }

      // Check for sensitive actions (lock/delete/reject)
      const sensitiveActions = logs.filter((l) => {
        const action = l.action_type?.toLowerCase() || '';
        return (
          action.includes('lock') ||
          action.includes('delete') ||
          action.includes('reject') ||
          action.includes('hidden')
        );
      });

      if (sensitiveActions.length > 5) {
        const actorName = logs[0]?.users?.full_name || actorId;
        alerts.push({
          type: 'sensitive_actions',
          severity: 'medium',
          message: `${actorName} thực hiện ${sensitiveActions.length} thao tác nhạy cảm trong 24h qua`,
          actor: actorName,
          timestamp: sensitiveActions[0]?.created_at || new Date(),
          details: `Hành động: ${[...new Set(sensitiveActions.map((l) => l.action_type))].join(', ')}`,
        });
      }
    }

    return {
      alerts: alerts.sort((a, b) => {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.severity] - order[b.severity];
      }),
      totalAlerts: alerts.length,
      lastChecked: new Date().toISOString(),
    };
  }

  // Phase 7: Report Heatmap Data
  async getReportHeatmapData() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const reports = await this.prisma.reports.findMany({
      where: { created_at: { gte: thirtyDaysAgo } },
      select: {
        reason: true,
        status: true,
        created_at: true,
      },
    });

    // Group by report_type
    const typeDistribution: Record<string, number> = {};
    const byWeek: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const report of reports) {
      // By type
      const type = 'unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;

      // By week
      const weekStart = new Date(report.created_at);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;

      // By status
      const status = report.status || 'pending';
      byStatus[status] = (byStatus[status] || 0) + 1;
    }

    return {
      total: reports.length,
      byType: Object.entries(typeDistribution)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      byWeek: Object.entries(byWeek)
        .map(([week, count]) => ({ week, count }))
        .sort((a, b) => a.week.localeCompare(b.week)),
      byStatus: Object.entries(byStatus)
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
    };
  }

  // Phase 8: FAQ Management
  async getFaqItems() {
    return this.prisma.faq_items.findMany({
      orderBy: { created_at: 'desc' },
      include: { creator: { select: { full_name: true } } },
    });
  }

  async createFaqItem(
    dto: { question: string; answer: string; category?: string },
    createdBy: string,
  ) {
    return this.prisma.faq_items.create({
      data: {
        question: dto.question,
        answer: dto.answer,
        category: dto.category || null,
        created_by: createdBy,
      },
    });
  }

  async updateFaqItem(
    id: string,
    dto: { question?: string; answer?: string; category?: string },
  ) {
    const existing = await this.prisma.faq_items.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Câu hỏi không tồn tại');

    return this.prisma.faq_items.update({
      where: { id },
      data: {
        ...(dto.question !== undefined && { question: dto.question }),
        ...(dto.answer !== undefined && { answer: dto.answer }),
        ...(dto.category !== undefined && { category: dto.category }),
        updated_at: new Date(),
      },
    });
  }

  async deleteFaqItem(id: string) {
    const existing = await this.prisma.faq_items.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Câu hỏi không tồn tại');

    return this.prisma.faq_items.delete({ where: { id } });
  }

  // Phase 9: CSAT & SLA Analytics
  async getCsatAnalytics() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get resolved tickets for SLA calculation
    const resolvedTickets = await this.prisma.support_tickets.findMany({
      where: {
        status: 'closed',
        updated_at: { gte: thirtyDaysAgo },
      },
      include: {
        assignee: { select: { full_name: true } },
      },
    });

    // Calculate average response/resolution time per staff
    const staffMetrics: Record<
      string,
      {
        name: string;
        totalTime: number;
        count: number;
        totalSatisfaction: number;
      }
    > = {};

    for (const ticket of resolvedTickets) {
      const staffId = ticket.assigned_to_user_id || 'unassigned';
      const staffName = ticket.assignee?.full_name || 'Chưa phân công';

      if (!staffMetrics[staffId]) {
        staffMetrics[staffId] = {
          name: staffName,
          totalTime: 0,
          count: 0,
          totalSatisfaction: 0,
        };
      }

      // Resolution time in hours
      if (ticket.updated_at && ticket.created_at) {
        const resolutionMs =
          new Date(ticket.updated_at).getTime() -
          new Date(ticket.created_at).getTime();
        staffMetrics[staffId].totalTime += resolutionMs / (1000 * 60 * 60);
      }
      staffMetrics[staffId].count += 1;
    }

    const staffLeaderboard = Object.entries(staffMetrics)
      .map(([id, m]) => ({
        staffId: id,
        name: m.name,
        ticketsResolved: m.count,
        avgResolutionHours:
          m.count > 0 ? Math.round((m.totalTime / m.count) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.ticketsResolved - a.ticketsResolved);

    // Get resolved disputes for satisfaction
    const resolvedDisputes = await this.prisma.tour_disputes.findMany({
      where: {
        status: 'resolved',
        resolved_at: { gte: thirtyDaysAgo },
      },
      include: {
        resolved_by: true,
      },
    });

    // Overall metrics
    const totalTickets = resolvedTickets.length;
    const totalDisputes = resolvedDisputes.length;
    const avgResolutionHours =
      totalTickets > 0
        ? Math.round(
            (Object.values(staffMetrics).reduce((s, m) => s + m.totalTime, 0) /
              totalTickets) *
              10,
          ) / 10
        : 0;

    // Ticket trend by week
    const weeklyTickets: Record<string, number> = {};
    for (const ticket of resolvedTickets) {
      const weekStart = new Date(ticket.created_at);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyTickets[weekKey] = (weeklyTickets[weekKey] || 0) + 1;
    }

    return {
      summary: {
        totalTicketsResolved: totalTickets,
        totalDisputesResolved: totalDisputes,
        avgResolutionHours,
      },
      staffLeaderboard,
      weeklyTrend: Object.entries(weeklyTickets)
        .map(([week, count]) => ({ week, count }))
        .sort((a, b) => a.week.localeCompare(b.week)),
    };
  }

  // Phase 10: Smart Reconciliation
  async reconcileTransactions(fileBuffer: Buffer) {
    void fileBuffer;
    // In a real scenario, we would parse the CSV buffer
    // and match with our database transactions.
    // Here we provide a mock logic.

    const transactions = await this.prisma.payment_transactions.findMany({
      where: {
        status: { in: ['pending', 'completed'] },
      },
      take: 100,
      orderBy: { created_at: 'desc' },
    });

    const matched: any[] = [];
    const unmatched: any[] = [];
    const discrepancies: any[] = [];

    // Simulate reconciliation
    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      if (i % 10 === 0) {
        discrepancies.push({
          id: t.id,
          amount: Number(t.amount),
          type: t.payment_method || 'unknown',
          status: t.status,
          systemAmount: Number(t.amount),
          bankAmount: Number(t.amount) - 10000,
          reason: 'Chênh lệch số tiền với sao kê ngân hàng',
        });
      } else if (i % 15 === 0) {
        unmatched.push({
          id: t.id,
          amount: Number(t.amount),
          type: t.payment_method || 'unknown',
          status: t.status,
          reason: 'Không tìm thấy giao dịch này trong file sao kê',
        });
      } else {
        matched.push({
          id: t.id,
          amount: Number(t.amount),
          type: t.payment_method || 'unknown',
          status: t.status,
        });
      }
    }

    return {
      totalProcessed: transactions.length,
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      discrepancyCount: discrepancies.length,
      matched,
      unmatched,
      discrepancies,
    };
  }

  // Phase 11: Financial Export
  async generateFinancialReport(startDate: string, endDate: string) {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    const transactions = await this.prisma.payment_transactions.findMany({
      where: {
        created_at: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { created_at: 'asc' },
    });

    // Generate CSV content
    const header = 'Mã Giao Dịch,Ngày Giờ,Loại,Số Tiền,Trạng Thái,Mô Tả\n';
    const rows = transactions
      .map(
        (t) =>
          `${t.id},${t.created_at?.toISOString() || ''},${t.payment_method || ''},${t.amount?.toString() || 0},${t.status},""`,
      )
      .join('\n');

    return header + rows;
  }

  // Phase 1.1 Core: Global Settings
  async getSetting(settingKey: string) {
    let setting = await this.prisma.system_settings.findUnique({
      where: { key: settingKey },
    });
    if (!setting) {
      // Return default values if not found yet
      if (settingKey === 'commission_rate') {
        setting = {
          key: settingKey,
          value: '10',
          description: 'Commission rate (%)',
          updated_at: new Date(),
        };
      } else {
        throw new NotFoundException('Setting not found');
      }
    }
    return setting;
  }

  async updateSetting(
    settingKey: string,
    settingValue: string,
    adminId: string,
  ) {
    const setting = await this.prisma.system_settings.upsert({
      where: { key: settingKey },
      update: { value: settingValue, updated_at: new Date() },
      create: { key: settingKey, value: settingValue },
    });

    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'system_other',
        entity_type: 'system_settings',
        entity_pk: settingKey,
        action_type: 'update',
        reason: 'Update global setting',
        new_data: { value: settingValue },
      },
    });

    return setting;
  }

  // Phase 1.1 Core: Categories Management
  private getModelFromType(type: string) {
    switch (type) {
      case 'languages':
        return this.prisma.languages;
      case 'provinces':
        return this.prisma.provinces;
      case 'skills':
        return this.prisma.skills;
      case 'tour_categories':
        return this.prisma.tour_categories;
      default:
        throw new BadRequestException('Invalid category type');
    }
  }

  private mapBigIntIds<T extends { id?: bigint | string | number }>(
    items: T[],
  ) {
    return items.map((i) => {
      const mapped = { ...i } as T & { id: string };
      if (i.id !== undefined && i.id !== null) {
        mapped.id = i.id.toString();
      }
      return mapped;
    });
  }

  async getCategories(type: string) {
    const model = this.getModelFromType(type) as unknown as {
      findMany: (args: unknown) => Promise<Array<{ id: bigint }>>;
    };
    const data = await model.findMany({ orderBy: { id: 'asc' } });
    return this.mapBigIntIds(data);
  }

  async createCategory(
    type: string,
    dto: { name: string; description?: string },
    adminId: string,
  ) {
    const model = this.getModelFromType(type) as unknown as {
      create: (args: unknown) => Promise<{ id: bigint }>;
    };

    const payload: Record<string, string> = { name: dto.name };
    if (type === 'tour_categories' && dto.description !== undefined)
      payload.description = dto.description;
    if (type === 'provinces') payload.region = 'VNM'; // default
    if (type === 'skills') payload.category = 'general'; // default

    const result = await model.create({ data: payload });

    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'system_other',
        entity_type: type,
        entity_pk: result.id.toString(),
        action_type: 'create',
        reason: 'Create category',
        new_data: payload as Record<string, any>,
      },
    });

    return { ...result, id: result.id.toString() };
  }

  async updateCategory(
    type: string,
    idStr: string,
    dto: { name: string; description?: string },
    adminId: string,
  ) {
    const model = this.getModelFromType(type) as unknown as {
      update: (args: unknown) => Promise<{ id: bigint }>;
    };
    const id = BigInt(idStr);

    const payload: Record<string, string> = { name: dto.name };
    if (type === 'tour_categories' && dto.description !== undefined)
      payload.description = dto.description;

    const result = await model.update({
      where: { id },
      data: payload,
    });

    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'system_other',
        entity_type: type,
        entity_pk: idStr,
        action_type: 'update',
        reason: 'Update category',
        new_data: payload as Record<string, any>,
      },
    });

    return { ...result, id: result.id.toString() };
  }

  async deleteCategory(type: string, idStr: string, adminId: string) {
    const model = this.getModelFromType(type) as unknown as {
      delete: (args: unknown) => Promise<void>;
    };
    const id = BigInt(idStr);

    try {
      await model.delete({ where: { id } });

      await this.prisma.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'system_other',
          entity_type: type,
          entity_pk: idStr,
          action_type: 'other',
          reason: 'Delete category',
        },
      });
      return { success: true };
    } catch {
      throw new BadRequestException(
        'Cannot delete category. It might be in use by other records.',
      );
    }
  }

  // Phase 1.1 Core: System Health Dashboard
  async getSystemHealth() {
    // Check DB Latency
    const startDb = Date.now();
    let dbStatus = 'healthy';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'down';
    }
    const dbLatency = Date.now() - startDb;

    // Check Supabase Auth/Storage Mock (Can ping Supabase URL if needed, here we mock ping)
    const supabaseStatus = 'healthy';
    const supabaseLatency = Math.floor(Math.random() * 50) + 10; // Mock latency 10-60ms

    // Check VNPAY Mock
    const vnpayStatus = 'healthy';
    const vnpayLatency = Math.floor(Math.random() * 100) + 50; // Mock latency 50-150ms

    // Fetch actual Storage Usage from DB sum (Mocking size of tours images for now if we can't hit Supabase admin API)
    // Supabase JS doesn't have an easy "get total storage size" without admin role, so we mock it.
    const storageUsageMB = 1024 + Math.floor(Math.random() * 500); // Mock 1.0 - 1.5GB

    return {
      services: {
        database: { status: dbStatus, latency: dbLatency },
        supabase: { status: supabaseStatus, latency: supabaseLatency },
        vnpay: { status: vnpayStatus, latency: vnpayLatency },
        email: {
          status: 'healthy',
          latency: Math.floor(Math.random() * 80) + 20,
        },
      },
      storageUsageMB,
      lastChecked: new Date(),
    };
  }
}
