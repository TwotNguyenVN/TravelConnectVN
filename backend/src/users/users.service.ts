import { Injectable, NotFoundException } from '@nestjs/common';
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
      });
      if (!user) throw new NotFoundException('User profile not found');
      return user;
    } catch (error) {
      console.error('DEBUG - Error in UsersService.findOne:', error);
      throw error;
    }
  }

  async update(id: string, data: any) {
    const updatedUser = await this.prisma.public_users.update({
      where: { id },
      data: {
        full_name: data.fullName,
        phone: data.phone,
        avatar_url: data.avatarUrl,
        date_of_birth: data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : undefined,
        gender: data.gender === '' ? null : data.gender,
        updated_at: new Date(),
      },
    });

    // Đồng bộ sang Supabase Auth Metadata
    try {
      await this.supabaseService.getAdminClient().auth.admin.updateUserById(id, {
        user_metadata: {
          full_name: data.fullName,
          avatar_url: data.avatarUrl,
        },
      });
    } catch (authError) {
      console.error('Failed to sync metadata to Supabase Auth:', authError);
      // Không ném lỗi ở đây để tránh làm hỏng quá trình update DB chính
    }

    // Ghi log hoạt động
    await this.activityLogsService.log(
      id,
      'profile.updated',
      'PROFILE',
      id,
      { updated_fields: Object.keys(data) },
    );

    return updatedUser;

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
