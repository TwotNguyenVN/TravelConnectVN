import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ChatService', () => {
  let service: ChatService;

  const mockPrisma = {
    conversations: {
      findUnique: jest.fn(),
    },
    messages: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    conversation_participants: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveMessage', () => {
    it('should throw NotFoundException if conversation not found', async () => {
      mockPrisma.conversations.findUnique.mockResolvedValue(null);

      await expect(
        service.saveMessage({
          conversationId: 'c1',
          senderId: 'u1',
          content: 'Hello',
          messageType: 'text',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should save and return message', async () => {
      mockPrisma.conversations.findUnique.mockResolvedValue({ id: 'c1' });
      const mockMessage = { id: 'm1', content: 'Hello', sender_user_id: 'u1' };
      mockPrisma.messages.create.mockResolvedValue(mockMessage);

      const result = await service.saveMessage({
        conversationId: 'c1',
        senderId: 'u1',
        content: 'Hello',
        messageType: 'text',
      });

      expect(result).toEqual(mockMessage);
      expect(mockPrisma.messages.create).toHaveBeenCalled();
    });
  });

  describe('getConversations', () => {
    it('should return mapped conversations for a user', async () => {
      mockPrisma.conversation_participants.findMany.mockResolvedValue([
        { conversations: { id: 'c1' } },
        { conversations: { id: 'c2' } },
      ]);

      const result = await service.getConversations('u1');
      expect(result).toEqual([{ id: 'c1' }, { id: 'c2' }]);
    });
  });

  describe('getMessages', () => {
    it('should return messages for a conversation', async () => {
      mockPrisma.messages.findMany.mockResolvedValue([
        { id: 'm1', content: 'msg1' },
      ]);

      const result = await service.getMessages('c1', 1, 10);
      expect(result).toEqual([{ id: 'm1', content: 'msg1' }]);
      expect(mockPrisma.messages.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { conversation_id: 'c1' },
          skip: 0,
          take: 10,
        }),
      );
    });
  });
});
