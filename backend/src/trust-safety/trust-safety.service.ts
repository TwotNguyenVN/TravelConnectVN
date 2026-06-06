import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrustSafetyService {
  private readonly logger = new Logger(TrustSafetyService.name);
  // Ngưỡng điểm uy tín để tạm ngưng HDV
  private readonly MINIMUM_SCORE_THRESHOLD = 50;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Trừ điểm uy tín của Hướng dẫn viên
   */
  async deductPoints(
    guideProfileId: string,
    points: number,
    reason: string,
  ) {
    const profile = await this.prisma.guide_profiles.findUnique({
      where: { id: guideProfileId },
    });

    if (!profile) return null;

    const newScore = Math.max(0, profile.reputation_score - points);
    const isSuspended = newScore < this.MINIMUM_SCORE_THRESHOLD;

    const updatedProfile = await this.prisma.guide_profiles.update({
      where: { id: guideProfileId },
      data: {
        reputation_score: newScore,
        ...(isSuspended
          ? { is_accepting_tours: false, visibility_status: 'hidden' }
          : {}),
      },
    });

    this.logger.log(
      `[Trust & Safety] Deducted ${points} points from guide ${guideProfileId}. New score: ${newScore}. Reason: ${reason}`,
    );

    if (isSuspended && profile.is_accepting_tours) {
      this.logger.warn(
        `[Trust & Safety] Guide ${guideProfileId} suspended due to low reputation score (${newScore})`,
      );
      // Có thể emit event để gửi thông báo cho HDV ở đây
    }

    return updatedProfile;
  }

  /**
   * Cộng điểm uy tín cho Hướng dẫn viên
   */
  async addPoints(
    guideProfileId: string,
    points: number,
    reason: string,
  ) {
    const profile = await this.prisma.guide_profiles.findUnique({
      where: { id: guideProfileId },
    });

    if (!profile) return null;

    // Tối đa 100 điểm
    const newScore = Math.min(100, profile.reputation_score + points);
    const isRestored =
      newScore >= this.MINIMUM_SCORE_THRESHOLD && !profile.is_accepting_tours;

    const updatedProfile = await this.prisma.guide_profiles.update({
      where: { id: guideProfileId },
      data: {
        reputation_score: newScore,
        ...(isRestored
          ? { is_accepting_tours: true, visibility_status: 'visible' }
          : {}),
      },
    });

    this.logger.log(
      `[Trust & Safety] Added ${points} points to guide ${guideProfileId}. New score: ${newScore}. Reason: ${reason}`,
    );

    return updatedProfile;
  }
}
