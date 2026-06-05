import { Test, TestingModule } from '@nestjs/testing';
import * as crypto from 'crypto';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SocketGateway } from '../socket/socket.gateway';
import { MailService } from '../mail/mail.service';
import { getQueueToken } from '@nestjs/bullmq';

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPrismaService = {
    tour_requests: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payment_transactions: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((promises) => Promise.all(promises)),
  };
  const mockNotificationsService = {
    create: jest.fn(),
  };
  const mockSocketGateway = {
    sendToUser: jest.fn(),
  };
  const mockMailService = {
    sendPaymentSuccessEmail: jest.fn(),
  };
  const mockMailQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: SocketGateway, useValue: mockSocketGateway },
        { provide: MailService, useValue: mockMailService },
        { provide: getQueueToken('mailQueue'), useValue: mockMailQueue },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentUrl', () => {
    it('should reject payment if tour request status is pending', async () => {
      mockPrismaService.tour_requests.findUnique.mockResolvedValue({
        id: 'req_123',
        user_id: 'user_123',
        status: 'pending',
        tours: { price: 100000 },
        participant_count: 2,
      });

      await expect(
        service.createPaymentUrl('user_123', 'req_123', '127.0.0.1'),
      ).rejects.toThrow(
        'Trạng thái yêu cầu không hợp lệ để thanh toán (Yêu cầu cần được duyệt trước)',
      );
    });
  });

  describe('vnpayIpn', () => {
    it('should return RspCode 04 if the vnp_Amount is incorrect', async () => {
      // Giả lập SHA512 hash hợp lệ cho dữ liệu test
      // Ta bỏ qua khâu hash bằng cách mock hàm helper vnpayIpn hoặc cấu hình hash khớp.
      // Do hash VNPAY sử dụng env hashsecret, ta có thể mock môi trường hoặc test trực tiếp.
      // Để đơn giản và chính xác hơn, ta sẽ thiết lập môi trường hash secret cho test và tạo checksum khớp.
      process.env.VNP_HASHSECRET = 'secret';

      const vnp_Params: Record<string, string | number> = {
        vnp_TxnRef: 'tx_123',
        vnp_ResponseCode: '00',
        vnp_Amount: '5000000', // VNPAY trả về 50,000 * 100
        vnp_SecureHash: 'mock_hash', // Sẽ được kiểm tra
      };

      // Mock transaction trong DB có số tiền khác (ví dụ: 100,000 đ thay vì 50,000 đ)
      mockPrismaService.payment_transactions.findUnique.mockResolvedValue({
        id: 'tx_123',
        amount: 100000,
        status: 'pending',
        tour_request_id: 'req_123',
      });

      // Để vượt qua kiểm tra checksum (secureHash === signed), ta mock sortObject & tính toán signed
      // Hoặc đơn giản là giả lập tham số checksum khớp.
      const signData =
        'vnp_Amount=5000000&vnp_ResponseCode=00&vnp_TxnRef=tx_123';

      const hmac = crypto.createHmac('sha512', 'secret');
      const correctHash = hmac
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');
      vnp_Params.vnp_SecureHash = correctHash;

      const result = await service.vnpayIpn(vnp_Params);
      expect(result).toEqual({ RspCode: '04', Message: 'Invalid amount' });
    });

    it('should process payment successfully when parameters are correct', async () => {
      process.env.VNP_HASHSECRET = 'secret';

      const vnp_Params: Record<string, string | number> = {
        vnp_TxnRef: 'tx_123',
        vnp_ResponseCode: '00',
        vnp_Amount: '5000000',
      };

      mockPrismaService.payment_transactions.findUnique.mockResolvedValue({
        id: 'tx_123',
        amount: 50000,
        status: 'pending',
        tour_request_id: 'req_123',
      });

      mockPrismaService.payment_transactions.findMany.mockResolvedValue([]);

      mockPrismaService.tour_requests.findUnique.mockResolvedValue({
        id: 'req_123',
        user_id: 'user_123',
        participant_count: 1,
        tours: {
          price: 5000000,
          title: 'Test Tour',
          guide_profiles: { user_id: 'guide_123' },
        },
        users_tour_requests_user_idTousers: {
          full_name: 'Test User',
          email: 'test@example.com',
        },
      });

      const signData =
        'vnp_Amount=5000000&vnp_ResponseCode=00&vnp_TxnRef=tx_123';

      const hmac = crypto.createHmac('sha512', 'secret');
      vnp_Params['vnp_SecureHash'] = hmac
        .update(Buffer.from(signData, 'utf-8'))
        .digest('hex');

      const result = await service.vnpayIpn(vnp_Params);
      expect(result).toEqual({ RspCode: '00', Message: 'Confirm Success' });
      expect(
        mockPrismaService.payment_transactions.update,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tx_123' },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: expect.objectContaining({ status: 'paid' }),
        }),
      );
    });
  });
});
