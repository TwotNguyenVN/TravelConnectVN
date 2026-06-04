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
import { DisputesService } from './disputes.service';
import { CreateDisputeDto, ResolveDisputeDto } from './dto/disputes.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('tour-requests')
@UseGuards(AuthGuard)
export class TourRequestsDisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post(':id/dispute')
  createDispute(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.disputesService.createDispute(id, req.user.id, dto.reason);
  }
}

@Controller('admin/disputes')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
export class AdminDisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get()
  getDisputes() {
    return this.disputesService.getDisputes();
  }

  @Get(':id/chat-history')
  getDisputeChatHistory(@Param('id') id: string) {
    return this.disputesService.getDisputeChatHistory(id);
  }

  @Patch(':id/resolve')
  resolveDispute(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveDispute(id, req.user.id, dto);
  }
}
