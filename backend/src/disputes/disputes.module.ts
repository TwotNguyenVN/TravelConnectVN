import { Module } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import {
  TourRequestsDisputesController,
  AdminDisputesController,
} from './disputes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [TourRequestsDisputesController, AdminDisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
