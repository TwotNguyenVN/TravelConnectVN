import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { GuidesModule } from './guides/guides.module';
import { ToursModule } from './tours/tours.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, 
    UsersModule, 
    RolesModule, 
    GuidesModule, 
    ToursModule, 
    AdminModule, 
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
