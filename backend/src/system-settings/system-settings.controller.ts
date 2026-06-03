/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { UpdateSettingDto } from './dto/system-settings.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Get('public')
  getPublicSettings() {
    return this.systemSettingsService.getPublicSettings();
  }

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SYSTEM_ADMIN)
  getAllSettings() {
    return this.systemSettingsService.getAllSettings();
  }

  @Patch(':key')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.SYSTEM_ADMIN)
  updateSetting(
    @Param('key') key: string,
    @Body() dto: UpdateSettingDto,
    @Req() req: any,
  ) {
    return this.systemSettingsService.updateSetting(
      key,
      dto.value,
      req.user.id,
    );
  }
}
