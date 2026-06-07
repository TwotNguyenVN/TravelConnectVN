import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: unknown;
  };
}

@ApiTags('Users')
@Controller('me')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.findOne(req.user.id);
    return {
      success: true,
      data: user,
    };
  }

  @Patch()
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() body: UpdateProfileDto,
  ) {
    const user = await this.usersService.update(req.user.id, body);
    return {
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: user,
    };
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async updateAvatar(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(
      'DEBUG - Controller received avatar upload request for user:',
      req.user.id,
    );
    if (!file) {
      console.error('DEBUG - No file received in controller');
      return { success: false, message: 'Không nhận được file ảnh' };
    }
    console.log('DEBUG - File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    try {
      const user = await this.usersService.updateAvatar(req.user.id, file);
      return {
        success: true,
        message: 'Cập nhật ảnh đại diện thành công',
        data: { avatarUrl: user.avatar_url },
      };
    } catch (error) {
      console.error('DEBUG - Error in updateAvatar controller:', error);
      throw error;
    }
  }

  @Get('roles')
  async getRoles(@Req() req: AuthenticatedRequest) {
    const roles = await this.usersService.getRoles(req.user.id);
    return {
      success: true,
      data: roles,
    };
  }
}
