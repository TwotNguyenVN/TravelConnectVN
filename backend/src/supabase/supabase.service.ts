import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key || key.includes('VUI-LONG-DIEN')) {
      this.logger.error(
        'Supabase configuration missing or placeholder found in .env',
      );
    }

    this.client = createClient(url as string, key as string);
    
    // Initialize admin client if serviceKey exists
    if (serviceKey && !serviceKey.includes('VUI-LONG-DIEN')) {
      this.adminClient = createClient(url as string, serviceKey);
    }
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  getAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      this.logger.error('SUPABASE_SERVICE_ROLE_KEY is missing! Admin operations will fail.');
      return this.client; // Fallback to normal client
    }
    return this.adminClient;
  }

  async verifyUser(token: string) {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser(token);
    
    if (error) {
      console.error('DEBUG - SupabaseService.verifyUser ERROR:', error.message);
      throw error;
    }
    
    if (!user) {
      console.error('DEBUG - SupabaseService.verifyUser: No user found for token');
      throw new Error('User not found');
    }
    
    return user;
  }

  async uploadAvatar(userId: string, file: any): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;
    console.log(`DEBUG - SupabaseService: Attempting to upload to bucket "avatars" at path: ${filePath}`);

    const { error } = await this.getAdminClient().storage
      .from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error(`DEBUG - Supabase storage upload ERROR:`, error);
      this.logger.error(`Error uploading avatar: ${error.message}`);
      throw error;
    }

    console.log('DEBUG - Upload success, getting public URL...');

    const { data } = this.client.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async deleteAvatar(url: string): Promise<void> {
    if (!url) return;

    try {
      // Trích xuất path từ URL (sau phần 'public/avatars/')
      const pathParts = url.split('/public/avatars/');
      if (pathParts.length < 2) return;

      const filePath = pathParts[1];
      console.log(`DEBUG - SupabaseService: Attempting to delete old avatar at path: ${filePath}`);

      const { error } = await this.getAdminClient().storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.warn('Could not delete old avatar (might have been manually deleted):', error.message);
      } else {
        console.log('DEBUG - Successfully deleted old avatar file from storage');
      }
    } catch (err) {
      console.error('Error in deleteAvatar:', err);
    }
  }
}
