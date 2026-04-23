import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { PrismaModule } from '../prisma/prisma.module';

import { UserActivityLogsModule } from '../user-activity-logs/user-activity-logs.module';

@Module({
  imports: [PrismaModule, UserActivityLogsModule],

  controllers: [FavoritesController],
  providers: [FavoritesService]
})
export class FavoritesModule {}
