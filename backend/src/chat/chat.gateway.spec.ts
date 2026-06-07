/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;

  const mockChatService = {
    saveMessage: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should disconnect if no token is provided', () => {
      const mockDisconnect = jest.fn();
      const mockClient = {
        handshake: { auth: {}, headers: {} },
        disconnect: mockDisconnect,
      } as unknown as Socket;

      gateway.handleConnection(mockClient);
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should verify token and attach user to client', () => {
      const mockDisconnect = jest.fn();
      const mockClient = {
        id: 'socket-1',
        handshake: { auth: { token: 'Bearer valid-token' }, headers: {} },
        disconnect: mockDisconnect,
        data: {},
      } as unknown as Socket;

      mockJwtService.verify.mockReturnValue({ sub: 'user-1' });

      gateway.handleConnection(mockClient);

      expect(mockJwtService.verify).toHaveBeenCalledWith(
        'valid-token',
        expect.any(Object),
      );
      expect((mockClient as any).data.user).toEqual({ sub: 'user-1' });
      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('handleSendMessage', () => {
    it('should save message and emit to room', async () => {
      const mockClient = {
        data: { user: { sub: 'user-1' } },
      } as unknown as Socket;

      const payload = {
        conversationId: 'conv-1',
        content: 'Hello',
      };

      const mockSavedMessage = { id: 'msg-1', content: 'Hello' };
      mockChatService.saveMessage.mockResolvedValue(mockSavedMessage);

      const mockEmit = jest.fn();
      const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
      gateway.server = { to: mockTo } as any;

      const result = await gateway.handleSendMessage(
        payload,
        mockClient as any,
      );

      expect(chatService.saveMessage).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hello',
        messageType: 'text',
        attachmentUrl: undefined,
      });

      expect(mockTo).toHaveBeenCalledWith('conversation_conv-1');
      expect(mockEmit).toHaveBeenCalledWith('new_message', mockSavedMessage);
      expect(result).toEqual(mockSavedMessage);
    });
  });
});
