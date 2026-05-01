import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

import { UserActivityLogsService } from '../user-activity-logs/user-activity-logs.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly activityLogsService: UserActivityLogsService,
  ) {}


  async findOne(id: string) {
    try {
      const user = await this.prisma.public_users.findUnique({
        where: { id },
        include: {
          user_preferences: true,
          user_roles_user_roles_user_idTousers: true,
        },
      });
      if (!user) throw new NotFoundException('User profile not found');
      return user;
    } catch (error) {
      console.error('DEBUG - Error in UsersService.findOne:', error);
      throw error;
    }
  }

  async getPublicProfile(id: string) {
    const user = await this.prisma.public_users.findUnique({
      where: { id },
      include: {
        guide_profiles: {
          select: { id: true, verification_status: true }
        },
        provinces: true,
        user_preferences: {
          include: {
            languages: true
          }
        },
        companion_posts: {
          where: { visibility_status: 'visible' },
          orderBy: { created_at: 'desc' },
          take: 6
        }
      }
    });

    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    // Resolve other languages names if they are IDs
    let otherLanguagesNames = user.user_preferences?.other_languages;
    if (otherLanguagesNames) {
      const ids = otherLanguagesNames.split(',').map(id => id.trim()).filter(id => !isNaN(Number(id)));
      if (ids.length > 0) {
        const languages = await this.prisma.languages.findMany({
          where: { id: { in: ids.map(id => BigInt(id)) } },
          select: { name: true }
        });
        otherLanguagesNames = languages.map(l => l.name).join(', ');
      }
    }

    return {
      id: user.id,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      coverUrl: user.cover_url,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      region: user.region,
      homeProvince: user.provinces?.name,
      joinedAt: user.created_at,
      facebookUrl: user.facebook_url,
      gender: user.gender,
      preferences: {
        travelStyle: user.user_preferences?.preferred_trip_style,
        preferredLanguage: user.user_preferences?.languages?.name,
        otherLanguages: otherLanguagesNames,
      },
      guideProfile: user.guide_profiles ? {
        id: user.guide_profiles.id,
        isVerified: user.guide_profiles.verification_status === 'verified' || user.guide_profiles.verification_status === 'approved'
      } : null,
      companionPosts: user.companion_posts.map(post => ({
        id: post.id,
        title: post.title,
        destination: post.destination,
        startDate: post.start_date,
        endDate: post.end_date,
        status: post.business_status,
        images: post.images
      }))
    };
  }

  async update(id: string, data: any) {
    try {
      // 1. Kiểm tra sự tồn tại của người dùng và lấy dữ liệu hiện tại
      const currentUser = await this.prisma.public_users.findUnique({
        where: { id },
        include: { user_preferences: true }
      });
      
      if (!currentUser) {
        throw new NotFoundException('Không tìm thấy người dùng');
      }

      // 2. Validate và chuẩn hóa dữ liệu
      const updateData: any = {
        updated_at: new Date(),
      };

      // Full Name
      if (data.fullName !== undefined) {
        updateData.full_name = data.fullName;
      }

      // Gender mapping & validation
      if (data.gender !== undefined) {
        if (!data.gender || data.gender === '') {
          updateData.gender = null;
        } else {
          const genderLower = data.gender.toLowerCase();
          if (genderLower === 'nam' || genderLower === 'male') updateData.gender = 'male';
          else if (genderLower === 'nữ' || genderLower === 'female') updateData.gender = 'female';
          else if (genderLower === 'khác' || genderLower === 'other') updateData.gender = 'other';
          else updateData.gender = 'other'; // Mặc định nếu không khớp
        }
      }

      // Date of birth validation
      if (data.dateOfBirth) {
        const dob = new Date(data.dateOfBirth);
        if (!isNaN(dob.getTime())) {
          updateData.date_of_birth = dob;
        }
      }

      // Phone handling with proactive conflict check
      if (data.phone !== undefined) {
        const newPhone = data.phone === '' ? null : data.phone;
        
        // Chỉ xử lý nếu phone thay đổi
        if (newPhone !== currentUser.phone) {
          if (newPhone !== null) {
            // Kiểm tra xem số điện thoại này đã được người khác sử dụng chưa
            const existingUser = await this.prisma.public_users.findFirst({
              where: {
                phone: newPhone,
                id: { not: id }
              }
            });
            
            if (existingUser) {
              throw new BadRequestException('Số điện thoại này đã được sử dụng bởi một tài khoản khác');
            }
          }
          updateData.phone = newPhone;
        }
      }

      // Location fields
      if (data.region !== undefined) updateData.region = data.region;
      if (data.homeProvinceId !== undefined) {
        updateData.home_province_id = data.homeProvinceId && data.homeProvinceId !== '' 
          ? BigInt(data.homeProvinceId) 
          : null;
      }

      // Media URLs
      if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;
      if (data.coverUrl !== undefined) updateData.cover_url = data.coverUrl;
      if (data.facebookUrl !== undefined) updateData.facebook_url = data.facebookUrl;

      // 3. Thực hiện cập nhật DB
      const updatedUser = await this.prisma.public_users.update({
        where: { id },
        data: updateData,
      });

      // 4. Cập nhật User Preferences (travel style, language)
      if (data.travelStyle !== undefined || data.preferredLanguageId !== undefined || data.otherLanguages !== undefined) {
        await this.prisma.user_preferences.upsert({
          where: { user_id: id },
          update: {
            preferred_trip_style: data.travelStyle ?? currentUser.user_preferences?.preferred_trip_style,
            preferred_language_id: data.preferredLanguageId && data.preferredLanguageId !== '' 
              ? BigInt(data.preferredLanguageId) 
              : (data.preferredLanguageId === '' ? null : currentUser.user_preferences?.preferred_language_id),
            other_languages: data.otherLanguages !== undefined ? data.otherLanguages : currentUser.user_preferences?.other_languages,
          },
          create: {
            user_id: id,
            preferred_trip_style: data.travelStyle || '',
            preferred_language_id: data.preferredLanguageId && data.preferredLanguageId !== '' 
              ? BigInt(data.preferredLanguageId) 
              : null,
            other_languages: data.otherLanguages || '',
          },
        });
      }

      // 5. Đồng bộ Metadata & Logging (Chạy background để không làm chậm response)
      this.syncAndLog(id, data);

      return updatedUser;
    } catch (error) {
      console.error('ERROR - UsersService.update:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      // Xử lý lỗi Unique constraint từ Prisma nếu lọt qua bước validate
      if (error.code === 'P2002') {
        throw new BadRequestException('Dữ liệu (số điện thoại hoặc email) đã tồn tại trong hệ thống');
      }
      throw new InternalServerErrorException('Đã có lỗi xảy ra khi cập nhật hồ sơ');
    }
  }

  // Phương thức phụ để đồng bộ metadata và ghi log
  private async syncAndLog(id: string, data: any) {
    try {
      // Sync to Supabase Auth
      if (data.fullName || data.avatarUrl) {
        await this.supabaseService.getAdminClient().auth.admin.updateUserById(id, {
          user_metadata: {
            full_name: data.fullName,
            avatar_url: data.avatarUrl,
          },
        });
      }

      // Log activity
      await this.activityLogsService.log(
        id,
        'profile.updated',
        'PROFILE',
        id,
        { updated_fields: Object.keys(data).filter(k => data[k] !== undefined) },
      );
    } catch (err) {
      console.error('Failed to sync/log profile update:', err);
    }
  }

  async getRoles(id: string) {
    const roles = await this.prisma.user_roles.findMany({
      where: { user_id: id },
      select: { role_code: true },
    });
    return roles.map((r) => r.role_code);
  }

  async updateAvatar(id: string, file: any) {
    console.log('DEBUG - UsersService.updateAvatar started for user:', id);
    
    // 1. Tìm thông tin avatar cũ để xóa
    try {
      const currentUser = await this.prisma.public_users.findUnique({
        where: { id },
        select: { avatar_url: true }
      });
      
      if (currentUser?.avatar_url) {
        console.log('DEBUG - Found old avatar, attempting to delete:', currentUser.avatar_url);
        await this.supabaseService.deleteAvatar(currentUser.avatar_url);
      }
    } catch (findError) {
      console.warn('Could not find user for old avatar cleanup, skipping deletion:', findError.message);
    }

    let avatarUrl: string;
    try {
      avatarUrl = await this.supabaseService.uploadAvatar(id, file);
      console.log('DEBUG - Successfully uploaded to storage. URL:', avatarUrl);
    } catch (uploadError) {
      console.error('DEBUG - Upload to storage failed:', uploadError);
      throw uploadError;
    }

    console.log('DEBUG - Updating database with new avatar URL...');
    const updatedUser = await this.prisma.public_users.update({
      where: { id },
      data: {
        avatar_url: avatarUrl,
        updated_at: new Date(),
      },
    });

    // Đồng bộ sang Supabase Auth Metadata (Chỉ thực hiện nếu có Service Role Key)
    try {
      const adminClient = this.supabaseService.getAdminClient();
      // Kiểm tra xem client có phải là admin client thực sự không (dựa trên key)
      if (process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY.includes('VUI-LONG-DIEN')) {
        await adminClient.auth.admin.updateUserById(id, {
          user_metadata: {
            avatar_url: avatarUrl,
          },
        });
      } else {
        console.warn('Skipping Auth Metadata sync: SUPABASE_SERVICE_ROLE_KEY is missing');
      }
    } catch (authError) {
      console.error('Failed to sync avatar to Supabase Auth:', authError);
    }

    // Ghi log hoạt động
    await this.activityLogsService.log(
      id,
      'profile.avatar_updated',
      'PROFILE',
      id,
      { avatar_url: avatarUrl },
    );

    return updatedUser;

  }
}
