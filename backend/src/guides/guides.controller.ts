import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GuidesService } from './guides.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  // ==========================================
  // PUBLIC ENDPOINTS
  // ==========================================

  @Get()
  async getGuides(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('workingArea') workingArea?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.guidesService.getPublicGuides({
      page,
      limit,
      workingArea,
      keyword,
    });
  }

  @Get('languages')
  async getLanguages() {
    return this.guidesService.getLanguages();
  }

  @Get('skills')
  async getSkills() {
    return this.guidesService.getSkills();
  }

  @Get(':id')
  async getGuideDetail(@Param('id') id: string) {
    return this.guidesService.getPublicGuideDetail(id);
  }

  // ==========================================
  // PRIVATE ENDPOINTS (GUIDE ONLY)
  // ==========================================

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Get('me/profile')
  async getMyProfile(@Request() req) {
    // req.user.id được gắn từ AuthGuard thực tế (Supabase JWT)
    const userId = req.user.id;
    return this.guidesService.getMyProfile(userId);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Post('me/profile')
  async createProfile(@Request() req, @Body() data: any) {
    const userId = req.user.id;
    return this.guidesService.createProfile(userId, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Patch('me/profile')
  async updateProfile(@Request() req, @Body() data: any) {
    const userId = req.user.id;
    return this.guidesService.updateProfile(userId, data);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Put('me/languages')
  async updateLanguages(
    @Request() req,
    @Body('languageIds') languageIds: number[],
  ) {
    const userId = req.user.id;
    return this.guidesService.updateLanguages(userId, languageIds);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.GUIDE)
  @Put('me/skills')
  async updateSkills(@Request() req, @Body('skillIds') skillIds: number[]) {
    const userId = req.user.id;
    return this.guidesService.updateSkills(userId, skillIds);
  }
}
