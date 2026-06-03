import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { GuideVerificationController } from './guide-verification.controller';
import { GuideVerificationService } from './guide-verification.service';
import { AuthGuard } from '../common/guards/auth.guard';

const mockAuthGuard = {
  canActivate: (_context: ExecutionContext) => true,
};

describe('GuideVerificationController', () => {
  let controller: GuideVerificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideVerificationController],
      providers: [
        {
          provide: GuideVerificationService,
          useValue: {
            createRequest: jest.fn(),
            uploadDocuments: jest.fn(),
            getMyRequest: jest.fn(),
            getPendingRequests: jest.fn(),
            getRequestDetails: jest.fn(),
            reviewRequest: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<GuideVerificationController>(GuideVerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
