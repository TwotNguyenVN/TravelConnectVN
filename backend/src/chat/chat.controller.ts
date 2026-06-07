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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ChatService } from './chat.service';
import { AuthGuard } from '../common/guards/auth.guard';
import * as fs from 'fs';

// Ensure upload directory exists
const uploadDir = './uploads/chat-media';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname) || '.webm';
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  uploadMedia(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    // Return relative URL that can be served by a static file server later
    // In production, this should return a Supabase/S3 public URL.
    const fileUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/chat-media/${file.filename}`;
    return { url: fileUrl };
  }
}
