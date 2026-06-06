import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('support')
@UseGuards(AuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  // =====================
  // TICKETS
  // =====================
  @Get('tickets')
  getTickets(@Query() params: any) {
    return this.supportService.getTickets(params);
  }

  @Patch('tickets/:id')
  updateTicket(
    @Param('id') id: string,
    @Body() body: { status?: string; assigned_to_user_id?: string }
  ) {
    return this.supportService.updateTicket(id, body);
  }

  // =====================
  // DISPUTES
  // =====================
  @Get('disputes')
  getDisputes(@Query() params: any) {
    return this.supportService.getDisputes(params);
  }

  @Post('disputes/:id/resolve')
  resolveDispute(
    @Param('id') id: string,
    @Body() body: { resolutionNote: string; refundAmount: number },
    @Req() req: AuthenticatedRequest
  ) {
    return this.supportService.resolveDispute(id, {
      resolutionNote: body.resolutionNote,
      refundAmount: body.refundAmount,
      resolvedByUserId: req.user.id
    });
  }

  // =====================
  // NOTIFICATIONS BROADCAST
  // =====================
  @Post('notifications/broadcast')
  broadcastNotification(@Body() body: { title: string; content: string; targetGroup: string }) {
    return this.supportService.broadcastNotification(body);
  }

  // =====================
  // FAQ
  // =====================
  @Get('faq')
  getFaqItems() {
    return this.supportService.getFaqItems();
  }

  @Post('faq')
  createFaqItem(
    @Body() body: { question: string; answer: string; category?: string },
    @Req() req: AuthenticatedRequest
  ) {
    return this.supportService.createFaqItem({ ...body, createdBy: req.user.id });
  }

  @Patch('faq/:id')
  updateFaqItem(
    @Param('id') id: string,
    @Body() body: { question?: string; answer?: string; category?: string }
  ) {
    return this.supportService.updateFaqItem(id, body);
  }

  @Delete('faq/:id')
  deleteFaqItem(@Param('id') id: string) {
    return this.supportService.deleteFaqItem(id);
  }
}
