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
}
