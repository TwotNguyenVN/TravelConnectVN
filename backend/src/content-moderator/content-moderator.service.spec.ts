import { Test, TestingModule } from '@nestjs/testing';
import { ContentModeratorService } from './content-moderator.service';

describe('ContentModeratorService', () => {
  let service: ContentModeratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentModeratorService],
    }).compile();

    service = module.get<ContentModeratorService>(ContentModeratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
