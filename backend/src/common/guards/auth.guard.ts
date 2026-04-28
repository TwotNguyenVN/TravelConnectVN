import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    console.log('DEBUG - AuthGuard: Received Authorization header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('DEBUG - AuthGuard: Missing or invalid header format');
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      console.log('DEBUG - AuthGuard: Attempting to verify token with Supabase...');
      const user = await this.supabaseService.verifyUser(token);
      console.log('DEBUG - AuthGuard: User verified:', user.id);

      // Fetch roles from DB
      const userRoles = await this.prisma.user_roles.findMany({
        where: { user_id: user.id },
        select: { role_code: true },
      });

      request.user = {
        ...user,
        roles: userRoles.map((r) => r.role_code),
      };

      // Cập nhật last_seen_at (Throttle: chỉ cập nhật nếu lần cuối cách đây > 2 phút)
      // Chạy ngầm để không block request
      this.updateLastSeen(user.id).catch((err) =>
        console.error('Error updating last_seen_at:', err),
      );

      return true;
    } catch (error) {
      console.error('DEBUG - AuthGuard Error:', error);
      if (error.code === 'P2021') {
        throw new UnauthorizedException('Database table not found. Please contact admin.');
      }
      throw new UnauthorizedException(
        `Authentication failed: ${error.message || 'Invalid or expired token'}`,
      );
    }
  }

  private async updateLastSeen(userId: string) {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    
    // Check last_seen_at trước khi update để tránh ghi DB quá nhiều
    const user = await this.prisma.public_users.findUnique({
      where: { id: userId },
      select: { last_seen_at: true },
    });

    if (!user?.last_seen_at || user.last_seen_at < twoMinutesAgo) {
      await this.prisma.public_users.update({
        where: { id: userId },
        data: { last_seen_at: new Date() },
      });
    }
  }
}
