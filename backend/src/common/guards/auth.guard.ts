import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Skeleton: TODO in Sprint 02 (Auth Implementation)
    // 1. Lấy token từ header (Authorization: Bearer <token>)
    // 2. Validate token thông qua Supabase Auth SDK
    // 3. Gắn user payload vào request.user
    
    // Hiện tại giả lập trả về true để cho phép pass skeleton check
    // request.user = { id: 'mock-user-id', roles: ['USER'] };
    
    // Nếu check false (ví dụ chưa truyền token trong bản thật)
    // throw new UnauthorizedException('Missing or invalid token');

    return true; 
  }
}
