/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto } from './dto/tickets.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Tickets')
@Controller('support/tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  createTicket(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(req.user.id, dto);
  }
}

@Controller('admin/tickets')
@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.SYSTEM_ADMIN, Role.SUPPORT_STAFF)
export class AdminTicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  getTickets(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('assignedToUserId') assignedToUserId?: string,
    @Query('search') search?: string,
  ) {
    return this.ticketsService.getTickets({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      status,
      category,
      assignedToUserId,
      search,
    });
  }

  @Patch(':id')
  updateTicket(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketsService.updateTicket(id, req.user.id, dto);
  }
}
