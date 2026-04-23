import { Test, TestingModule } from '@nestjs/testing';
import { GuideVerificationController } from './guide-verification.controller';

describe('GuideVerificationController', () => {
  let controller: GuideVerificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideVerificationController],
    }).compile();

    controller = module.get<GuideVerificationController>(GuideVerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
