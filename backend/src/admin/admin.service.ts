import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserStatus, UpdateUserStatusDto, AssignRoleDto, ModerationDto, ProcessReportDto, ProcessVerificationDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [userCount, tourCount, companionCount, reportCount, pendingVerificationCount, totalRevenue] = await Promise.all([
      this.prisma.public_users.count(),
      this.prisma.tours.count(),
      this.prisma.companion_posts.count(),
      this.prisma.reports.count({ where: { status: 'open' } }),
      this.prisma.guide_verification_requests.count({ where: { status: 'pending' } }),
      this.prisma.payment_transactions.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      })
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
        _count: { user_id: true }
      }),
      this.prisma.public_users.groupBy({
        by: ['status'],
        _count: { id: true }
      })
    ]);

    return {
      roles: roleBreakdown.map(r => ({ name: r.role_code, value: r._count.user_id })),
      statuses: statusBreakdown.map(s => ({ name: s.status, value: s._count.id }))
    };
  }

  async getStatisticsTours() {
    const [categoryBreakdown, provinceBreakdown] = await Promise.all([
      this.prisma.tours.groupBy({
        by: ['category_id'],
        _count: { id: true }
      }),
      this.prisma.tours.groupBy({
        by: ['province'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      })
    ]);

    // Fetch category names
    const categories = await this.prisma.tour_categories.findMany();
    const categoryMap = new Map(categories.map(c => [c.id.toString(), c.name]));

    return {
      categories: categoryBreakdown.map(c => ({ 
        name: (c.category_id ? categoryMap.get(c.category_id.toString()) : null) || 'Unknown', 
        value: c._count.id 
      })),

      provinces: provinceBreakdown.map(p => ({ name: p.province, value: p._count.id }))
    };
  }

  async getStatisticsReports() {
    const [statusBreakdown, typeBreakdown] = await Promise.all([
      this.prisma.reports.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      this.prisma.reports.groupBy({
        by: ['target_type'],
        _count: { id: true }
      })
    ]);

    return {
      statuses: statusBreakdown.map(s => ({ name: s.status, value: s._count.id })),
      types: typeBreakdown.map(t => ({ name: t.target_type, value: t._count.id }))
    };
  }

  async getStatisticsRevenue() {
    // Last 7 days revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await this.prisma.$queryRaw`
      SELECT 
        DATE(paid_at) as date, 
        SUM(amount) as total 
      FROM payment_transactions 
      WHERE status = 'paid' AND paid_at >= ${sevenDaysAgo}
      GROUP BY DATE(paid_at)
      ORDER BY date ASC
    `;

    return {
      daily: (dailyRevenue as any[]).map(d => ({
        date: new Date(d.date).toLocaleDateString('vi-VN'),
        amount: Number(d.total)
      }))
    };
  }


  // User Management
  async getUsers(params: { skip?: number; take?: number; role?: string; status?: string; search?: string }) {
    const { skip, take, role, status, search } = params;
    
    const where: any = {};
    if (status) where.status = status;
    if (role) {
      where.user_roles_user_roles_user_idTousers = {
        some: { role_code: role }
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
            select: { role_code: true }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.public_users.count({ where })
    ]);

    return { items, total };
  }

  async updateUserStatus(id: string, dto: UpdateUserStatusDto, adminId: string) {
    const user = await this.prisma.public_users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.public_users.update({
      where: { id },
      data: { status: dto.status }
    });

    // Log activity
    await this.prisma.admin_activity_logs.create({
      data: {
        actor_user_id: adminId,
        module_name: 'user_management',
        entity_type: 'users',
        entity_pk: id,
        action_type: dto.status === 'locked' ? 'lock_account' : 'unlock_account',
        reason: dto.reason,
        old_data: { status: user.status },
        new_data: { status: dto.status }
      }
    });

    return updatedUser;
  }

  async assignRole(userId: string, dto: AssignRoleDto, adminId: string) {
    const user = await this.prisma.public_users.findUnique({ 
      where: { id: userId },
      include: { user_roles_user_roles_user_idTousers: true }
    });
    if (!user) throw new NotFoundException('User not found');

    const roleExists = await this.prisma.roles.findUnique({ where: { role_code: dto.roleCode } });
    if (!roleExists) throw new BadRequestException('Role does not exist');

    const alreadyHasRole = user.user_roles_user_roles_user_idTousers.some(ur => ur.role_code === dto.roleCode);
    if (alreadyHasRole) throw new BadRequestException('User already has this role');

    const result = await this.prisma.$transaction(async (tx) => {
      const ur = await tx.user_roles.create({
        data: {
          user_id: userId,
          role_code: dto.roleCode,
          assigned_by: adminId
        }
      });

      await tx.user_role_change_logs.create({
        data: {
          target_user_id: userId,
          changed_role_code: dto.roleCode,
          action_type: 'assign',
          changed_by_user_id: adminId,
          note: dto.note,
          old_snapshot: user.user_roles_user_roles_user_idTousers,
          new_snapshot: [...user.user_roles_user_roles_user_idTousers, { role_code: dto.roleCode }]
        }
      });

      return ur;
    });

    return result;
  }

  async revokeRole(userId: string, roleCode: string, adminId: string) {
    const user = await this.prisma.public_users.findUnique({ 
      where: { id: userId },
      include: { user_roles_user_roles_user_idTousers: true }
    });
    if (!user) throw new NotFoundException('User not found');

    const hasRole = user.user_roles_user_roles_user_idTousers.some(ur => ur.role_code === roleCode);
    if (!hasRole) throw new BadRequestException('User does not have this role');

    if (userId === adminId && roleCode === 'SYSTEM_ADMIN') {
      throw new BadRequestException('Cannot revoke your own admin role');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.user_roles.delete({
        where: {
          user_id_role_code: {
            user_id: userId,
            role_code: roleCode
          }
        }
      });

      await tx.user_role_change_logs.create({
        data: {
          target_user_id: userId,
          changed_role_code: roleCode,
          action_type: 'revoke',
          changed_by_user_id: adminId,
          old_snapshot: user.user_roles_user_roles_user_idTousers,
          new_snapshot: user.user_roles_user_roles_user_idTousers.filter(ur => ur.role_code !== roleCode)
        }
      });

      return { success: true };
    });

    return result;
  }

  // Reports
  async getReports(params: { skip?: number; take?: number; status?: string; targetType?: string }) {
    const { skip, take, status, targetType } = params;
    const where: any = {};
    if (status) where.status = status;
    if (targetType) where.target_type = targetType;

    const [items, total] = await Promise.all([
      this.prisma.reports.findMany({
        where,
        skip,
        take,
        include: {
          users_reports_reporter_user_idTousers: { select: { full_name: true, email: true } },
          users_reports_assigned_to_user_idTousers: { select: { full_name: true } }
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.reports.count({ where })
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
          assigned_to_user_id: dto.status === 'assigned' ? adminId : report.assigned_to_user_id
        }
      });

      await tx.report_processing_history.create({
        data: {
          report_id: id,
          action_by_user_id: adminId,
          action_type: 'status_changed',
          old_status: report.status,
          new_status: dto.status,
          note: dto.resolution_note
        }
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
      data: { visibility_status: dto.visibility_status }
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
        new_data: { visibility_status: dto.visibility_status }
      }
    });

    return updated;
  }

  async moderateCompanionPost(id: string, dto: ModerationDto, adminId: string) {
    const post = await this.prisma.companion_posts.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    const updated = await this.prisma.companion_posts.update({
      where: { id },
      data: { visibility_status: dto.visibility_status }
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
        new_data: { visibility_status: dto.visibility_status }
      }
    });

    return updated;
  }

  async getTours(params: { skip?: number; take?: number; status?: string; visibility?: string; search?: string }) {
    const { skip, take, status, visibility, search } = params;
    const where: any = {};
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
              users: { select: { full_name: true } }
            }
          }
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.tours.count({ where })
    ]);

    return { items, total };
  }

  async getCompanionPosts(params: { skip?: number; take?: number; visibility?: string; search?: string }) {
    const { skip, take, visibility, search } = params;
    const where: any = {};
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
          users: { select: { full_name: true } }
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.companion_posts.count({ where })
    ]);

    return { items, total };
  }

  // Verification
  async getVerificationRequests() {
    return this.prisma.guide_verification_requests.findMany({
      include: {
        guide_profiles: {
          include: {
            users: { select: { full_name: true, email: true } }
          }
        },
        guide_verification_documents: true
      },
      orderBy: { submitted_at: 'desc' }
    });
  }

  async processVerification(id: string, dto: ProcessVerificationDto, adminId: string) {
    const request = await this.prisma.guide_verification_requests.findUnique({ 
      where: { id },
      include: { guide_profiles: true }
    });
    if (!request) throw new NotFoundException('Request not found');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedReq = await tx.guide_verification_requests.update({
        where: { id },
        data: {
          status: dto.status,
          processed_by_user_id: adminId,
          processed_at: new Date(),
          result_note: dto.result_note
        }
      });

      await tx.guide_profiles.update({
        where: { id: request.guide_profile_id },
        data: {
          verification_status: dto.status,
          visibility_status: dto.status === 'approved' ? 'visible' : request.guide_profiles.visibility_status
        }
      });

      await tx.admin_activity_logs.create({
        data: {
          actor_user_id: adminId,
          module_name: 'guide_verification',
          entity_type: 'guide_verification_requests',
          entity_pk: id,
          action_type: dto.status === 'approved' ? 'approve' : 'reject',
          reason: dto.result_note
        }
      });

      return updatedReq;
    });

    return result;
  }

  // Activity Logs
  async getActivityLogs(params: { skip?: number; take?: number; module?: string }) {
    const { skip, take, module } = params;
    const where: any = {};
    if (module) where.module_name = module;

    const [items, total] = await Promise.all([
      this.prisma.admin_activity_logs.findMany({
        where,
        skip,
        take,
        include: {
          users: { select: { full_name: true } }
        },
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.admin_activity_logs.count({ where })
    ]);

    return { items, total };
  }
}
