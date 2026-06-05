import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GuidesModule } from './guides/guides.module';
import { ToursModule } from './tours/tours.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TourRequestsModule } from './tour-requests/tour-requests.module';
import { CompanionPostsModule } from './companion-posts/companion-posts.module';
import { SocketModule } from './socket/socket.module';
import { ConfigModule } from '@nestjs/config';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GuideVerificationModule } from './guide-verification/guide-verification.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserActivityLogsModule } from './user-activity-logs/user-activity-logs.module';
import { ChatModule } from './chat/chat.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { PaymentsModule } from './payments/payments.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { TripExpensesModule } from './trip-expenses/trip-expenses.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import {
  MaintenanceService,
  MaintenanceGuard,
} from './common/guards/maintenance.guard';

import { CompanionReviewsModule } from './companion-reviews/companion-reviews.module';
import { SosModule } from './sos/sos.module';
import { TicketsModule } from './tickets/tickets.module';
import { DisputesModule } from './disputes/disputes.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
          ttl: 60 * 1000, // 1 minute default TTL
        });
        return {
          store: store as unknown as any,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // max 100 requests per minute
      },
    ]),
    ScheduleModule.forRoot(),
    SchedulerModule,
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    GuidesModule,
    ToursModule,
    AdminModule,
    ReportsModule,
    HealthModule,
    TourRequestsModule,
    CompanionPostsModule,
    CompanionReviewsModule,
    SocketModule,
    FavoritesModule,
    ReviewsModule,
    GuideVerificationModule,
    NotificationsModule,
    UserActivityLogsModule,
    ChatModule,
    RecommendationsModule,
    AccommodationsModule,
    PaymentsModule,
    AiChatModule,
    TripExpensesModule,
    SosModule,
    TicketsModule,
    DisputesModule,
    MailModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MaintenanceService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: MaintenanceGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        const { method, originalUrl } = req;
        const start = Date.now();
        res.on('finish', () => {
          const duration = Date.now() - start;
          console.log(
            `[HTTP] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
          );
        });
        next();
      })
      .forRoutes('*');
  }
}
