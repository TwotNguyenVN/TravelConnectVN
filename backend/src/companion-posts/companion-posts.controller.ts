import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { CompanionPostsService } from './companion-posts.service';
import { CreateCompanionPostDto } from './dto/create-companion-post.dto';
import { UpdateCompanionPostDto } from './dto/update-companion-post.dto';
import { CompanionPostQueryDto } from './dto/companion-post-query.dto';
import { CreateCompanionRequestDto } from './dto/create-companion-request.dto';
import { ProcessCompanionRequestDto } from './dto/process-companion-request.dto';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';

@ApiTags('companion-posts')
@Controller('companion-posts')
export class CompanionPostsController {
  constructor(private readonly companionPostsService: CompanionPostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public companion posts' })
  async getPublicPosts(@Query() query: CompanionPostQueryDto) {
    return this.companionPostsService.getPublicCompanionPosts(query);
  }

  @Get('my-posts')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user companion posts' })
  async getMyPosts(@Request() req, @Query() query: any) {
    const userId = req.user.id;
    return this.companionPostsService.getMyCompanionPosts(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get companion post detail' })
  async getPostDetail(@Param('id') id: string) {
    return this.companionPostsService.getCompanionPostDetail(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new companion post' })
  async createPost(@Request() req, @Body() data: CreateCompanionPostDto) {
    const userId = req.user.id;
    return this.companionPostsService.createCompanionPost(userId, data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a companion post' })
  async updatePost(
    @Request() req,
    @Param('id') id: string,
    @Body() data: UpdateCompanionPostDto,
  ) {
    const userId = req.user.id;
    return this.companionPostsService.updateCompanionPost(userId, id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a companion post' })
  async deletePost(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.companionPostsService.softDeleteCompanionPost(userId, id);
  }

  // ==========================================
  // COMPANION REQUESTS ENDPOINTS
  // ==========================================

  @Post('requests')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a join request to a post' })
  async sendRequest(@Request() req, @Body() data: CreateCompanionRequestDto) {
    const userId = req.user.id;
    return this.companionPostsService.sendJoinRequest(userId, data);
  }

  @Get('requests/me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user sent join requests' })
  async getMySentRequests(@Request() req, @Query() query: any) {
    const userId = req.user.id;
    return this.companionPostsService.getMySentRequests(userId, query);
  }

  @Get(':id/requests')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get requests for a specific post (Owner only)' })
  async getPostRequests(
    @Request() req,
    @Param('id') id: string,
    @Query() query: any,
  ) {
    const userId = req.user.id;
    return this.companionPostsService.getPostRequests(userId, id, query);
  }

  @Patch('requests/:id/cancel')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a pending join request' })
  async cancelRequest(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.companionPostsService.cancelJoinRequest(userId, id);
  }

  @Patch('requests/:id/approve')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve a join request (Owner only)' })
  async approveRequest(
    @Request() req,
    @Param('id') id: string,
    @Body() data: ProcessCompanionRequestDto,
  ) {
    const userId = req.user.id;
    return this.companionPostsService.approveJoinRequest(userId, id, data);
  }

  @Patch('requests/:id/reject')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject a join request (Owner only)' })
  async rejectRequest(
    @Request() req,
    @Param('id') id: string,
    @Body() data: ProcessCompanionRequestDto,
  ) {
    const userId = req.user.id;
    return this.companionPostsService.rejectJoinRequest(userId, id, data);
  }

  @Get(':id/my-request')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user request for a specific post' })
  async getMyRequestForPost(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.companionPostsService.getMyRequestForPost(userId, id);
  }
}
