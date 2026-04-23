import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuidesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách hướng dẫn viên công khai
   */
  async getPublicGuides(query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      visibility_status: 'visible',
      deleted_at: null,
    };

    if (query.workingArea) {
      where.working_area = { contains: query.workingArea, mode: 'insensitive' };
    }

    if (query.keyword) {
      where.OR = [
        { bio: { contains: query.keyword, mode: 'insensitive' } },
        {
          users: {
            full_name: { contains: query.keyword, mode: 'insensitive' },
          },
        },
      ];
    }

    const [guides, total] = await Promise.all([
      this.prisma.guide_profiles.findMany({
        where,
        include: {
          users: {
            select: {
              full_name: true,
              avatar_url: true,
            },
          },
          guide_languages: {
            include: { languages: true },
          },
          guide_skills: {
            include: { skills: true },
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.guide_profiles.count({ where }),
    ]);

    return {
      data: await Promise.all(guides.map((g) => this.formatGuidePublic(g))),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy chi tiết hướng dẫn viên công khai
   */
  async getPublicGuideDetail(id: string) {
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            full_name: true,
            avatar_url: true,
          },
        },
        guide_languages: {
          include: { languages: true },
        },
        guide_skills: {
          include: { skills: true },
        },
        guide_reviews: {
          where: { visibility_status: 'visible' },
          include: { users: true },
          take: 5,
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!guide || guide.visibility_status !== 'visible' || guide.deleted_at) {
      throw new NotFoundException('Không tìm thấy hướng dẫn viên');
    }

    return this.formatGuideDetail(guide);
  }

  /**
   * Lấy hồ sơ cá nhân của Guide hiện tại
   */
  async getMyProfile(userId: string) {
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
      include: {
        guide_languages: {
          include: {
            languages: true,
          },
        },
        guide_skills: {
          include: {
            skills: true,
          },
        },
        home_province: true,
      },
    });

    if (!guide) {
      return null;
    }

    // Format to camelCase to match frontend interface
    return {
      id: guide.id,
      userId: guide.user_id,
      bio: guide.bio || '',
      yearsOfExperience: guide.years_of_experience || 0,
      workingArea: guide.working_area || '',
      verificationStatus: guide.verification_status,
      visibilityStatus: guide.visibility_status,
      isAcceptingTours: guide.is_accepting_tours,
      otherLanguages: guide.other_languages || '',
      otherSkills: guide.other_skills || '',
      guideLanguages: guide.guide_languages.map((gl) => ({
        language: {
          id: Number(gl.languages.id),
          name: gl.languages.name,
        },
      })),
      guideSkills: guide.guide_skills.map((gs) => ({
        skill: {
          id: Number(gs.skills.id),
          name: gs.skills.name,
        },
      })),
      homeProvinceId: guide.home_province_id ? Number(guide.home_province_id) : null,
      homeProvince: guide.home_province ? {
        id: Number(guide.home_province.id),
        name: guide.home_province.name,
        region: guide.home_province.region,
      } : null,
      familiarProvinces: guide.familiar_provinces || '',
      region: guide.region || '',
    };
  }

  /**
   * Tạo hồ sơ hướng dẫn viên
   */
  async createProfile(userId: string, data: any) {
    const existing = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (existing) {
      throw new BadRequestException('Bạn đã có hồ sơ hướng dẫn viên');
    }

    return this.prisma.guide_profiles.create({
      data: {
        user_id: userId,
        bio: data.bio,
        years_of_experience: data.yearsOfExperience,
        working_area: data.workingArea,
        avatar_url: data.avatarUrl,
        visibility_status: data.visibilityStatus || 'visible',
        is_accepting_tours: data.isAcceptingTours ?? true,
        other_languages: data.otherLanguages,
        other_skills: data.otherSkills,
        home_province_id: data.homeProvinceId ? BigInt(data.homeProvinceId) : null,
        familiar_provinces: data.familiarProvinces,
        region: data.region,
      },
    });
  }

  /**
   * Cập nhật hồ sơ
   */
  async updateProfile(userId: string, data: any) {
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guide) {
      throw new NotFoundException('Hồ sơ không tồn tại');
    }

    return this.prisma.guide_profiles.update({
      where: { user_id: userId },
      data: {
        bio: data.bio,
        years_of_experience: data.yearsOfExperience,
        working_area: data.workingArea,
        avatar_url: data.avatarUrl,
        visibility_status: data.visibilityStatus,
        is_accepting_tours: data.isAcceptingTours,
        other_languages: data.otherLanguages,
        other_skills: data.otherSkills,
        home_province_id: data.homeProvinceId ? BigInt(data.homeProvinceId) : null,
        familiar_provinces: data.familiarProvinces,
        region: data.region,
      },
    });
  }

  /**
   * Cập nhật ngôn ngữ
   */
  async updateLanguages(userId: string, languageIds: number[]) {
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guide) throw new NotFoundException('Hồ sơ không tồn tại');

    return this.prisma.$transaction([
      this.prisma.guide_languages.deleteMany({
        where: { guide_profile_id: guide.id },
      }),
      this.prisma.guide_languages.createMany({
        data: languageIds.map((id) => ({
          guide_profile_id: guide.id,
          language_id: BigInt(id),
        })),
      }),
    ]);
  }

  /**
   * Cập nhật kỹ năng
   */
  async updateSkills(userId: string, skillIds: number[]) {
    const guide = await this.prisma.guide_profiles.findUnique({
      where: { user_id: userId },
    });

    if (!guide) throw new NotFoundException('Hồ sơ không tồn tại');

    return this.prisma.$transaction([
      this.prisma.guide_skills.deleteMany({
        where: { guide_profile_id: guide.id },
      }),
      this.prisma.guide_skills.createMany({
        data: skillIds.map((id) => ({
          guide_profile_id: guide.id,
          skill_id: BigInt(id),
        })),
      }),
    ]);
  }

  /**
   * Lấy danh mục ngôn ngữ đang hoạt động
   */
  async getLanguages() {
    const languages = await this.prisma.languages.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
    return languages.map((l) => ({ ...l, id: Number(l.id) }));
  }

  /**
   * Lấy danh mục kỹ năng đang hoạt động
   */
  async getSkills() {
    const skills = await this.prisma.skills.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    });
    return skills.map((s) => ({ ...s, id: Number(s.id) }));
  }

  /**
   * Lấy danh sách tỉnh thành
   */
  async getProvinces() {
    const provinces = await this.prisma.provinces.findMany({
      orderBy: { id: 'asc' },
    });
    return provinces.map((p) => ({
      ...p,
      id: Number(p.id),
    }));
  }

  // Helpers
  private async getGuideAverageRating(guideId: string) {
    const aggregate = await this.prisma.guide_reviews.aggregate({
      where: { guide_profile_id: guideId, visibility_status: 'visible' },
      _avg: { rating: true },
    });
    return aggregate._avg.rating || 5.0;
  }

  private async formatGuidePublic(g: any) {
    const rating = await this.getGuideAverageRating(g.id);
    return {
      id: g.id,
      name: g.users?.full_name || 'Hướng dẫn viên',
      avatar: g.avatar_url || g.users?.avatar_url || '',
      workingArea: g.working_area || 'Việt Nam',
      yearsOfExperience: g.years_of_experience || 0,
      rating: rating,
      verificationStatus: g.verification_status,
      languages: [
        ...g.guide_languages.map((gl: any) => gl.languages.name),
        ...(g.other_languages ? g.other_languages.split(',').map((s: string) => s.trim()) : []),
      ],
      skills: [
        ...g.guide_skills.map((gs: any) => gs.skills.name),
        ...(g.other_skills ? g.other_skills.split(',').map((s: string) => s.trim()) : []),
      ],
    };
  }

  private async formatGuideDetail(g: any) {
    const publicInfo = await this.formatGuidePublic(g);
    return {
      ...publicInfo,
      bio: g.bio || '',
      isAcceptingTours: g.is_accepting_tours,
      reviews: g.guide_reviews.map((r: any) => ({
        id: r.id,
        user: r.users?.full_name || 'Người dùng',
        avatar: r.users?.avatar_url || '',
        rating: r.rating,
        comment: r.comment,
        date: r.created_at,
      })),
    };
  }
}
