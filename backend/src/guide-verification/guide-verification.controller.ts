import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { GuideVerificationService } from './guide-verification.service';
import { CreateVerificationRequestDto } from './dto/create-verification.dto';

@Controller('guide-verification')
@UseGuards(AuthGuard)
export class GuideVerificationController {
  constructor(private readonly verificationService: GuideVerificationService) {}

  @Post('request')
  @Roles(Role.GUIDE)
  @UseGuards(RoleGuard)
  async createRequest(@Request() req, @Body() dto: CreateVerificationRequestDto) {
    const userId = req.user.id;
    return this.verificationService.createRequest(userId, dto);
  }

  @Get('my-requests')
  @Roles(Role.GUIDE)
  @UseGuards(RoleGuard)
  async getMyRequests(@Request() req) {
    const userId = req.user.id;
    return this.verificationService.getMyRequests(userId);
  }

  @Get('status')
  @Roles(Role.GUIDE)
  @UseGuards(RoleGuard)
  async getStatus(@Request() req) {
    const userId = req.user.id;
    return this.verificationService.getLatestStatus(userId);
  }

  @Get(':id')
  @Roles(Role.GUIDE)
  @UseGuards(RoleGuard)
  async getDetail(@Param('id') id: string) {
    return this.verificationService.getRequestDetail(id);
  }
}
