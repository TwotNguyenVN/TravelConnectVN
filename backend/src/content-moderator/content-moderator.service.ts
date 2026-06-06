import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrustSafetyService } from '../trust-safety/trust-safety.service';

@Injectable()
export class ContentModeratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly trustSafetyService: TrustSafetyService,
  ) {}

  async getPendingGuides() {
    return this.prisma.guide_verification_requests.findMany({
      where: { status: 'pending' },
      include: {
        guide_profiles: {
          include: {
            users: {
              select: { email: true, phone: true },
            },
          },
        },
        guide_verification_documents: true,
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async processGuideVerification(
    requestId: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ) {
    const request = await this.prisma.guide_verification_requests.findUnique({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Verification request not found');

    const updatedRequest =
      await this.prisma.guide_verification_requests.update({
        where: { id: requestId },
        data: {
          status,
          submission_note: reason
            ? `${request.submission_note || ''}\nModerator note: ${reason}`
            : request.submission_note,
        },
      });

    if (status === 'approved') {
      await this.prisma.guide_profiles.update({
        where: { id: request.guide_profile_id },
        data: { verification_status: 'verified' },
      });
    } else {
      await this.prisma.guide_profiles.update({
        where: { id: request.guide_profile_id },
        data: { verification_status: 'rejected' },
      });
    }

    return updatedRequest;
  }

  async getFlaggedTours() {
    return this.prisma.tours.findMany({
      where: {
        OR: [
          { visibility_status: 'hidden' },
          { reports: { some: { status: 'open' } } },
        ],
      },
      include: {
        reports: {
          where: { status: 'open' },
        },
        guide_profiles: {
          include: { users: { select: { email: true } } },
        },
      },
    });
  }
}
