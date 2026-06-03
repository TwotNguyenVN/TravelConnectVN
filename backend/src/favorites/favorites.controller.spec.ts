import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '../common/guards/auth.guard';

const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => true,
};

describe('FavoritesController', () => {
  let controller: FavoritesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            addTourFavorite: jest.fn(),
            removeTourFavorite: jest.fn(),
            getMyFavoriteTours: jest.fn(),
            isTourFavorited: jest.fn(),
            addGuideFavorite: jest.fn(),
            removeGuideFavorite: jest.fn(),
            getMyFavoriteGuides: jest.fn(),
            isGuideFavorited: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<FavoritesController>(FavoritesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
