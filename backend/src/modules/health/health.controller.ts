import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import type { ApiResponse } from '../../common/interfaces/response.interface';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(): Promise<ApiResponse<any>> {
    const healthData = await this.healthService.checkHealth();

    return {
      success: true,
      message: 'Service is healthy',
      data: healthData,
    };
  }
}
