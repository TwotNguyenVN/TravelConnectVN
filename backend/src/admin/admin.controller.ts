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
  UploadedFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    role: string;
  };
}
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { MaintenanceService } from '../common/guards/maintenance.guard';
import {
  UpdateUserStatusDto,
  AssignRoleDto,
  ModerationDto,
  ProcessReportDto,
  ProcessVerificationDto,
  CreateStaffDto,
  AnalyzeContentDto,
  UpdateTransactionStatusDto,
} from './dto/admin.dto';

@Controller('admin')
@UseGuards(AuthGuard, RoleGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly maintenanceService: MaintenanceService,
  ) {}

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
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.updateUserStatus(id, dto, req.user.id);
  }

  @Post('users/:id/roles')
  @Roles(Role.SYSTEM_ADMIN)
  assignRole(
    @Param('id') id: string,
    @Body() dto: AssignRoleDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.assignRole(id, dto, req.user.id);
  }

  @Delete('users/:id/roles/:role')
  @Roles(Role.SYSTEM_ADMIN)
  revokeRole(
    @Param('id') id: string,
    @Param('role') role: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.revokeRole(id, role, req.user.id);
  }

  @Post('staff')
  @Roles(Role.SYSTEM_ADMIN)
  createStaff(@Body() dto: CreateStaffDto, @Req() req: AuthenticatedRequest) {
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
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.processReport(id, dto, req.user.id);
  }

  // Moderation
  @Patch('tours/:id/moderation')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  moderateTour(
    @Param('id') id: string,
    @Body() dto: ModerationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.moderateTour(id, dto, req.user.id);
  }

  @Patch('companion-posts/:id/moderation')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  moderateCompanionPost(
    @Param('id') id: string,
    @Body() dto: ModerationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.moderateCompanionPost(id, dto, req.user.id);
  }

  @Post('moderation/analyze')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  analyzeContent(@Body() dto: AnalyzeContentDto) {
    return this.adminService.analyzeContent(dto.text);
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
    @Req() req: AuthenticatedRequest,
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

  @Patch('transactions/:id/status')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  updateTransactionStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.updateTransactionStatus(
      id,
      dto.status,
      req.user.id,
    );
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
  settleGuideTransactions(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.settleGuideTransactions(id, req.user.id);
  }

  @Post('notifications/broadcast')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  sendBroadcastNotification(
    @Body()
    dto: {
      title: string;
      message: string;
      targetRole?: string;
      targetUserId?: string;
    },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.sendBroadcastNotification(dto, req.user.id);
  }

  // Soft Delete Recovery Console
  @Get('recovery/deleted')
  @Roles(Role.SYSTEM_ADMIN)
  getDeletedItems() {
    return this.adminService.getDeletedItems();
  }

  @Post('recovery/:type/:id/restore')
  @Roles(Role.SYSTEM_ADMIN)
  restoreDeletedItem(
    @Param('type') type: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.restoreDeletedItem(type, id, req.user.id);
  }

  // Phase 5: Maintenance Mode
  @Get('settings/maintenance')
  @Roles(Role.SYSTEM_ADMIN)
  getMaintenanceStatus() {
    return this.maintenanceService.getStatus();
  }

  @Post('settings/maintenance')
  @Roles(Role.SYSTEM_ADMIN)
  toggleMaintenance(
    @Body() dto: { enabled: boolean },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.maintenanceService.toggle(dto.enabled, req.user.id);
  }

  // Phase 6: Anomaly Detection
  @Get('anomalies')
  @Roles(Role.SYSTEM_ADMIN)
  getAnomalyAlerts() {
    return this.adminService.getAnomalyAlerts();
  }

  // Phase 7: Report Heatmap
  @Get('reports/heatmap')
  @Roles(Role.SYSTEM_ADMIN, Role.CONTENT_MODERATOR)
  getReportHeatmapData() {
    return this.adminService.getReportHeatmapData();
  }

  // Phase 8: FAQ Management
  @Get('faq')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  getFaqItems() {
    return this.adminService.getFaqItems();
  }

  @Post('faq')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  createFaqItem(
    @Body() dto: { question: string; answer: string; category?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.createFaqItem(dto, req.user.id);
  }

  @Patch('faq/:id')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  updateFaqItem(
    @Param('id') id: string,
    @Body() dto: { question?: string; answer?: string; category?: string },
  ) {
    return this.adminService.updateFaqItem(id, dto);
  }

  @Delete('faq/:id')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  deleteFaqItem(@Param('id') id: string) {
    return this.adminService.deleteFaqItem(id);
  }

  // Phase 9: CSAT & SLA Analytics
  @Get('analytics/csat')
  @Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
  getCsatAnalytics() {
    return this.adminService.getCsatAnalytics();
  }

  // Phase 10: Smart Reconciliation
  @Post('finance/reconcile')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  @UseInterceptors(FileInterceptor('file'))
  reconcileTransactions(@UploadedFile() file: { buffer: Buffer }) {
    if (!file) {
      throw new Error('Vui lòng tải lên file sao kê');
    }
    return this.adminService.reconcileTransactions(file.buffer);
  }

  // Phase 11: Financial Export
  @Get('finance/export')
  @Roles(Role.SYSTEM_ADMIN, Role.ACCOUNTANT)
  async exportFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // Return CSV string
    const csv = await this.adminService.generateFinancialReport(
      startDate,
      endDate,
    );
    return { data: csv };
  }

  // Phase 1.1 Core: Global Settings
  @Get('settings/:key')
  @Roles(Role.SYSTEM_ADMIN)
  getSetting(@Param('key') key: string) {
    return this.adminService.getSetting(key);
  }

  @Patch('settings/:key')
  @Roles(Role.SYSTEM_ADMIN)
  updateSetting(
    @Param('key') key: string,
    @Body() dto: { value: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.updateSetting(key, dto.value, req.user.id);
  }

  // Phase 1.1 Core: Categories Management
  @Get('categories/:type')
  @Roles(Role.SYSTEM_ADMIN)
  getCategories(@Param('type') type: string) {
    return this.adminService.getCategories(type);
  }

  @Post('categories/:type')
  @Roles(Role.SYSTEM_ADMIN)
  createCategory(
    @Param('type') type: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.createCategory(type, dto, req.user.id);
  }

  @Patch('categories/:type/:id')
  @Roles(Role.SYSTEM_ADMIN)
  updateCategory(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.updateCategory(type, id, dto, req.user.id);
  }

  @Delete('categories/:type/:id')
  @Roles(Role.SYSTEM_ADMIN)
  deleteCategory(
    @Param('type') type: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.adminService.deleteCategory(type, id, req.user.id);
  }

  // Phase 1.1 Core: System Health Dashboard
  @Get('system/health')
  @Roles(Role.SYSTEM_ADMIN)
  getSystemHealth() {
    return this.adminService.getSystemHealth();
  }
}
