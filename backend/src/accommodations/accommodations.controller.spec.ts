import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsController } from './accommodations.controller';
import { AccommodationsService } from './accommodations.service';

describe('AccommodationsController', () => {
  let controller: AccommodationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccommodationsController],
      providers: [
        {
          provide: AccommodationsService,
          useValue: {
            createAccommodation: jest.fn(),
            getAccommodationsByTour: jest.fn(),
            updateAccommodation: jest.fn(),
            deleteAccommodation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccommodationsController>(AccommodationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
