import { Module, Global } from '@nestjs/common';
import { UserActivityLogsController } from './user-activity-logs.controller';
import { UserActivityLogsService } from './user-activity-logs.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Global()
@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [UserActivityLogsController],
  providers: [UserActivityLogsService],
  exports: [UserActivityLogsService],
})
export class UserActivityLogsModule {}
