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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
  ],


  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        const { method, originalUrl } = req;
        const start = Date.now();
        res.on('finish', () => {
          const duration = Date.now() - start;
          console.log(`[HTTP] ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`);
        });
        next();
      })
      .forRoutes('*');
  }
}
