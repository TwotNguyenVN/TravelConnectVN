import { Module } from '@nestjs/common';
import { SosService } from './sos.service';
import { SosController, AdminSosController } from './sos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [SosController, AdminSosController],
  providers: [SosService],
  exports: [SosService],
})
export class SosModule {}
