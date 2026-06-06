import { Test, TestingModule } from '@nestjs/testing';
import { ContentModeratorController } from './content-moderator.controller';

describe('ContentModeratorController', () => {
  let controller: ContentModeratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentModeratorController],
    }).compile();

    controller = module.get<ContentModeratorController>(ContentModeratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
