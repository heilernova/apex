import { Test, TestingModule } from '@nestjs/testing';
import { GeoRepository } from './geo.repository';

describe('GeoRepository', () => {
  let service: GeoRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoRepository],
    }).compile();

    service = module.get<GeoRepository>(GeoRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
