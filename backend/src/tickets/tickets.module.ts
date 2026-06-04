import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {
  TicketsController,
  AdminTicketsController,
} from './tickets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [TicketsController, AdminTicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
