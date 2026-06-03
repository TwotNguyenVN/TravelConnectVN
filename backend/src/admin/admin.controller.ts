import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import {
  UpdateUserStatusDto,
  AssignRoleDto,
  ModerationDto,
  ProcessReportDto,
  ProcessVerificationDto,
  CreateStaffDto,
} from './dto/admin.dto';

@Controller('admin')
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR, Role.SUPPORT_STAFF)
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('statistics/users')
  @Roles(Role.SYSTEM_ADMIN)
  getStatisticsUsers() {
    return this.adminService.getStatisticsUsers();
  }

  @Get('statistics/tours')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  getStatisticsTours() {
    return this.adminService.getStatisticsTours();
  }

  @Get('statistics/reports')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  getStatisticsReports() {
    return this.adminService.getStatisticsReports();
  }

  @Get('statistics/revenue')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  getStatisticsRevenue() {
    return this.adminService.getStatisticsRevenue();
  }

  // User Management
  @Get('users')
  @Roles(Role.SYSTEM_ADMIN)
  getUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      role,
      status,
      search,
    });
  }

  @Patch('users/:id/status')
  @Roles(Role.SYSTEM_ADMIN)
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() req: any,
  ) {
    return this.adminService.updateUserStatus(id, dto, req.user.id);
  }

  @Post('users/:id/roles')
  @Roles(Role.SYSTEM_ADMIN)
  assignRole(
    @Param('id') id: string,
    @Body() dto: AssignRoleDto,
    @Req() req: any,
  ) {
    return this.adminService.assignRole(id, dto, req.user.id);
  }

  @Delete('users/:id/roles/:role')
  @Roles(Role.SYSTEM_ADMIN)
  revokeRole(
    @Param('id') id: string,
    @Param('role') role: string,
    @Req() req: any,
  ) {
    return this.adminService.revokeRole(id, role, req.user.id);
  }

  @Post('staff')
  @Roles(Role.SYSTEM_ADMIN)
  createStaff(@Body() dto: CreateStaffDto, @Req() req: any) {
    return this.adminService.createStaff(dto, req.user.id);
  }

  // Reports
  @Get('reports')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF, Role.CONTENT_MODERATOR)
  getReports(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('targetType') targetType?: string,
  ) {
    return this.adminService.getReports({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      targetType,
    });
  }

  @Patch('reports/:id')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF, Role.CONTENT_MODERATOR)
  processReport(
    @Param('id') id: string,
    @Body() dto: ProcessReportDto,
    @Req() req: any,
  ) {
    return this.adminService.processReport(id, dto, req.user.id);
  }

  // Moderation
  @Patch('tours/:id/moderation')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  moderateTour(
    @Param('id') id: string,
    @Body() dto: ModerationDto,
    @Req() req: any,
  ) {
    return this.adminService.moderateTour(id, dto, req.user.id);
  }

  @Patch('companion-posts/:id/moderation')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  moderateCompanionPost(
    @Param('id') id: string,
    @Body() dto: ModerationDto,
    @Req() req: any,
  ) {
    return this.adminService.moderateCompanionPost(id, dto, req.user.id);
  }

  @Get('tours')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  getTours(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('visibility') visibility?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getTours({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      visibility,
      search,
    });
  }

  @Get('companion-posts')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  getCompanionPosts(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('visibility') visibility?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getCompanionPosts({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      visibility,
      search,
    });
  }

  // Verification
  @Get('guides/verification')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  getVerificationRequests() {
    return this.adminService.getVerificationRequests();
  }

  @Patch('guides/verification/:id')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  processVerification(
    @Param('id') id: string,
    @Body() dto: ProcessVerificationDto,
    @Req() req: any,
  ) {
    return this.adminService.processVerification(id, dto, req.user.id);
  }

  // Activity Logs
  @Get('activity-logs')
  @Roles(Role.SYSTEM_ADMIN)
  getActivityLogs(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('module') module?: string,
  ) {
    return this.adminService.getActivityLogs({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      module,
    });
  }

  // Transaction Management
  @Get('transactions')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  getTransactions(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getTransactions({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      search,
    });
  }

  // Refund Management
  @Get('refunds/pending')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  getPendingRefunds() {
    return this.adminService.getPendingRefunds();
  }

  @Post('refunds/:id/process')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  processRefund(
    @Param('id') id: string,
    @Body() body: { action: 'approve' | 'reject'; note?: string },
  ) {
    return this.adminService.processRefund(id, body.action, body.note);
  }

  // Guide Settlements
  @Get('guides/settlements')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  getGuideSettlements() {
    return this.adminService.getGuideSettlements();
  }

  @Post('guides/:id/settle')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  settleGuideTransactions(@Param('id') id: string, @Req() req: any) {
    return this.adminService.settleGuideTransactions(id, req.user.id);
  }

  @Post('notifications/broadcast')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  sendBroadcastNotification(
    @Body() dto: { title: string; message: string; targetRole?: string; targetUserId?: string },
    @Req() req: any,
  ) {
    return this.adminService.sendBroadcastNotification(dto, req.user.id);
  }
}
