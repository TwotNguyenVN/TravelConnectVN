import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';
import { FinanceCronService } from './finance.cron';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [AdminController],
  providers: [AdminService, FinanceCronService],
  exports: [AdminService],
})
export class AdminModule {}
