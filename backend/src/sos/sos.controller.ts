/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SosService } from './sos.service';
import { CreateSosDto, ResolveSosDto } from './dto/create-sos.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('sos')
@UseGuards(AuthGuard)
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Post()
  createSos(@Req() req: any, @Body() dto: CreateSosDto) {
    return this.sosService.createSos(req.user.id, dto);
  }
}

@Controller('admin/sos')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
export class AdminSosController {
  constructor(private readonly sosService: SosService) {}

  @Get()
  getSosAlerts() {
    return this.sosService.getSosAlerts();
  }

  @Patch(':id/resolve')
  resolveSos(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: ResolveSosDto,
  ) {
    return this.sosService.resolveSos(id, req.user.id, dto.note);
  }
}
