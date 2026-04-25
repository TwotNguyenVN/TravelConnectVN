import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // ==========================================
  // TOUR FAVORITES
  // ==========================================

  @Post('tours/:tourId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a tour to favorites' })
  async addTourFavorite(@Request() req, @Param('tourId') tourId: string) {
    const userId = req.user.id;
    return this.favoritesService.addTourFavorite(userId, tourId);
  }

  @Delete('tours/:tourId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a tour from favorites' })
  async removeTourFavorite(@Request() req, @Param('tourId') tourId: string) {
    const userId = req.user.id;
    return this.favoritesService.removeTourFavorite(userId, tourId);
  }

  @Get('me/tours')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user favorite tours' })
  async getMyFavoriteTours(@Request() req) {
    const userId = req.user.id;
    return this.favoritesService.getMyFavoriteTours(userId);
  }

  @Get('check/tour/:tourId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if a tour is favorited' })
  async checkTourFavorite(@Request() req, @Param('tourId') tourId: string) {
    const userId = req.user.id;
    return this.favoritesService.isTourFavorited(userId, tourId);
  }

  // ==========================================
  // GUIDE FAVORITES
  // ==========================================

  @Post('guides/:guideId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a guide to favorites' })
  async addGuideFavorite(@Request() req, @Param('guideId') guideId: string) {
    const userId = req.user.id;
    return this.favoritesService.addGuideFavorite(userId, guideId);
  }

  @Delete('guides/:guideId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove a guide from favorites' })
  async removeGuideFavorite(@Request() req, @Param('guideId') guideId: string) {
    const userId = req.user.id;
    return this.favoritesService.removeGuideFavorite(userId, guideId);
  }

  @Get('me/guides')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user favorite guides' })
  async getMyFavoriteGuides(@Request() req) {
    const userId = req.user.id;
    return this.favoritesService.getMyFavoriteGuides(userId);
  }

  @Get('check/guide/:guideId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if a guide is favorited' })
  async checkGuideFavorite(@Request() req, @Param('guideId') guideId: string) {
    const userId = req.user.id;
    return this.favoritesService.isGuideFavorited(userId, guideId);
  }
}
