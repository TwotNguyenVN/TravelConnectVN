import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { SosService } from '../sos/sos.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Support')
@Controller('support')
@UseGuards(AuthGuard)
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly sosService: SosService,
  ) {}

  // =====================
  // TICKETS
  // =====================
  @Get('tickets')
  getTickets() {
    return this.supportService.getTickets();
  }

  @Patch('tickets/:id')
  updateTicket(
    @Param('id') id: string,
    @Body() body: { status?: string; assigned_to_user_id?: string },
  ) {
    return this.supportService.updateTicket(id, body);
  }

  // =====================
  // DISPUTES
  // =====================
  @Get('disputes')
  getDisputes() {
    return this.supportService.getDisputes();
  }

  @Post('disputes/:id/resolve')
  resolveDispute(
    @Param('id') id: string,
    @Body() body: { resolutionNote: string; refundAmount: number },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.supportService.resolveDispute(id, {
      resolutionNote: body.resolutionNote,
      refundAmount: body.refundAmount,
      resolvedByUserId: req.user.id,
    });
  }

  // =====================
  // NOTIFICATIONS BROADCAST
  // =====================
  @Post('notifications/broadcast')
  broadcastNotification(
    @Body() body: { title: string; content: string; targetGroup: string },
  ) {
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
    @Req() req: AuthenticatedRequest,
  ) {
    return this.supportService.createFaqItem({
      ...body,
      createdBy: req.user.id,
    });
  }

  @Patch('faq/:id')
  updateFaqItem(
    @Param('id') id: string,
    @Body() body: { question?: string; answer?: string; category?: string },
  ) {
    return this.supportService.updateFaqItem(id, body);
  }

  @Delete('faq/:id')
  deleteFaqItem(@Param('id') id: string) {
    return this.supportService.deleteFaqItem(id);
  }

  // =====================
  // SOS / EMERGENCY DASHBOARD
  // =====================
  @Get('sos')
  getSosAlerts() {
    return this.sosService.getSosAlerts();
  }

  @Patch('sos/:id/resolve')
  resolveSosAlert(
    @Param('id') id: string,
    @Body() body: { note: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.sosService.resolveSos(id, req.user.id, body.note);
  }

  // =====================
  // CSAT & SLA ANALYTICS
  // =====================
  @Get('analytics/csat')
  getCsatAnalytics() {
    return this.supportService.getCsatAnalytics();
  }

  // =====================
  // AGENT CO-PILOT
  // =====================
  @Post('copilot/suggest')
  getCopilotSuggestion(@Body() body: { text: string }) {
    return this.supportService.getCopilotSuggestion(body.text);
  }
}
