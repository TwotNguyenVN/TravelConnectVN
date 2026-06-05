import { Global, Module } from '@nestjs/common';
import { MaintenanceService } from './guards/maintenance.guard';

@Global()
@Module({
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
