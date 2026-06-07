import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const language = request.headers['accept-language'] || 'vi';

    return next.handle().pipe(
      map((data) => {
        if (language.startsWith('en')) {
          return this.translateData(data);
        }
        return data;
      }),
    );
  }

  private translateData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.translateData(item));
    }

    if (typeof data === 'object') {
      const translated = { ...data };
      for (const key of Object.keys(translated)) {
        // Nếu có trường _en (ví dụ title_en) và không rỗng
        const enKey = `${key}_en`;
        if (translated[enKey] !== undefined && translated[enKey] !== null && translated[enKey] !== '') {
          translated[key] = translated[enKey];
        }

        // Đệ quy cho nested objects
        if (typeof translated[key] === 'object') {
          translated[key] = this.translateData(translated[key]);
        }
      }
      return translated;
    }

    return data;
  }
}
