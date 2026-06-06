import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ContentModeratorService } from './content-moderator.service';

@Controller('content-moderator')
export class ContentModeratorController {
  constructor(private readonly moderatorService: ContentModeratorService) {}

  @Get('pending-guides')
  async getPendingGuides() {
    return this.moderatorService.getPendingGuides();
  }

  @Post('guides/:id/process')
  async processGuide(
    @Param('id') id: string,
    @Body('status') status: 'approved' | 'rejected',
    @Body('reason') reason?: string,
  ) {
    return this.moderatorService.processGuideVerification(id, status, reason);
  }

  @Get('flagged-tours')
  async getFlaggedTours() {
    return this.moderatorService.getFlaggedTours();
  }
}
