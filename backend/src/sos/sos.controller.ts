/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SosService } from './sos.service';
import { CreateSosDto } from './dto/create-sos.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('sos')
@UseGuards(AuthGuard)
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Post()
  createSos(@Req() req: any, @Body() dto: CreateSosDto) {
    return this.sosService.createSos(req.user.id, dto);
  }
}
