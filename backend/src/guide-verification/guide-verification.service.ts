import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVerificationRequestDto } from './dto/create-verification.dto';

import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class GuideVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}

  async createRequest(userId: string, dto: CreateVerificationRequestDto) {
    let guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) {
      // Tự động tạo hồ sơ hướng dẫn viên mặc định cho người dùng nếu chưa có
      guideProfile = await this.prisma.guide_profiles.create({
        data: {
          user_id: userId,
          verification_status: 'not_submitted',
          visibility_status: 'visible',
          is_accepting_tours: true,
          bio: '',
          years_of_experience: 0,
          working_area: '',
        },
      });
    }

    // 2. Kiểm tra xem có yêu cầu nào đang chờ xử lý không
    const existingPending = await this.prisma.guide_verification_requests.findFirst({
      where: {
        guide_profile_id: guideProfile.id,
        status: 'pending',
      },
    });

    if (existingPending) {
      throw new BadRequestException('Bạn đã có một yêu cầu xác minh đang chờ xử lý.');
    }

    // 3. Tạo yêu cầu mới trong transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const request = await tx.guide_verification_requests.create({
        data: {
          guide_profile_id: guideProfile.id,
          status: 'pending',
          submission_note: dto.submissionNote,
        },
      });

      // Tạo các tài liệu đi kèm
      const documents = dto.documents.map((doc) => ({
        verification_request_id: request.id,
        document_type: doc.documentType,
        file_url: doc.fileUrl,
        status: 'submitted',
      }));

      if (documents.length > 0) {
        await tx.guide_verification_documents.createMany({
          data: documents,
        });
      }

      // Cập nhật trạng thái profile sang pending
      await tx.guide_profiles.update({
        where: { id: guideProfile.id },
        data: { verification_status: 'pending' },
      });

      // Fetch lại đầy đủ thông tin bằng tx để tránh lỗi 404 do chưa commit
      return tx.guide_verification_requests.findUnique({
        where: { id: request.id },
        include: {
          guide_verification_documents: true,
        },
      });
    });

    // 4. Ghi log hoạt động
    if (result) {
      await this.activityLogsService.log(
        userId,
        'guide.verification_submitted',
        'GUIDE_VERIFICATION_REQUEST',
        result.id,
        { document_count: dto.documents.length },
      );
    }

    return result;
  }


  async getMyRequests(userId: string) {
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) return [];

    return this.prisma.guide_verification_requests.findMany({
      where: { guide_profile_id: guideProfile.id },
      include: {
        guide_verification_documents: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getRequestDetail(id: string) {
    const request = await this.prisma.guide_verification_requests.findUnique({
      where: { id },
      include: {
        guide_verification_documents: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Không tìm thấy yêu cầu xác minh');
    }

    return request;
  }

  async getLatestStatus(userId: string) {
    const guideProfile = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guideProfile) return null;

    const latest = await this.prisma.guide_verification_requests.findFirst({
      where: { guide_profile_id: guideProfile.id },
      include: {
        guide_verification_documents: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      profileStatus: guideProfile.verification_status,
      latestRequest: latest,
    };
  }
}
