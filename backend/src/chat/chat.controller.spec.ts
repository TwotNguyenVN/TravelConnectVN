/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';

describe('ChatController', () => {
  let controller: ChatController;
  let supabaseService: SupabaseService;

  const mockChatService = {
    getConversations: jest.fn(),
    getMessages: jest.fn(),
  };

  const mockSupabaseService = {
    uploadChatMedia: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ChatController>(ChatController);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadMedia', () => {
    it('should throw BadRequestException if no file is provided', async () => {
      await expect(
        controller.uploadMedia(
          undefined as unknown as Express.Multer.File,
          'conv-1',
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if no conversationId is provided', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      await expect(
        controller.uploadMedia(mockFile, undefined as unknown as string),
      ).rejects.toThrow(BadRequestException);
    });

    it('should upload file and return URL', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const mockUrl = 'https://supabase.com/chat-media/test.jpg';
      mockSupabaseService.uploadChatMedia.mockResolvedValue(mockUrl);

      const result = await controller.uploadMedia(mockFile, 'conv-1');

      expect(supabaseService.uploadChatMedia).toHaveBeenCalledWith(
        'conv-1',
        mockFile,
      );
      expect(result).toEqual({ url: mockUrl });
    });

    it('should throw BadRequestException on upload failure', async () => {
      const mockFile = {
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      mockSupabaseService.uploadChatMedia.mockRejectedValue(
        new Error('Upload failed'),
      );

      await expect(controller.uploadMedia(mockFile, 'conv-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
