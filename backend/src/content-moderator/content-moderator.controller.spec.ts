import { Test, TestingModule } from '@nestjs/testing';
import { ContentModeratorController } from './content-moderator.controller';
import { ContentModeratorService } from './content-moderator.service';

describe('ContentModeratorController', () => {
  let controller: ContentModeratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentModeratorController],
      providers: [
        { provide: ContentModeratorService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ContentModeratorController>(ContentModeratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
