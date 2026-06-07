import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ChatService } from './chat.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get('conversations')
  async getConversations(@Request() req: { user: { sub: string } }) {
    const userId = req.user?.sub;
    if (!userId) {
      return [];
    }
    return this.chatService.getConversations(userId);
  }

  @Get('conversations/:id/messages')
  async getMessages(
    @Param('id') conversationId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.chatService.getMessages(
      conversationId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Post('media')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async uploadMedia(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp|mp3|wav|webm|m4a)' }),
        ],
      }),
    ) file: Express.Multer.File,
    @Body('conversationId') conversationId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    if (!conversationId) {
      throw new BadRequestException('conversationId is required');
    }

    try {
      const publicUrl = await this.supabaseService.uploadChatMedia(
        conversationId,
        file,
      );
      return { url: publicUrl };
    } catch {
      throw new BadRequestException('Failed to upload media file');
    }
  }
}
