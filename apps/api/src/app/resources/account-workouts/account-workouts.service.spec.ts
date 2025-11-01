import { Test, TestingModule } from '@nestjs/testing';
import { AccountWorkoutsService } from './account-workouts.service';

describe('AccountWorkoutsService', () => {
  let service: AccountWorkoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountWorkoutsService],
    }).compile();

    service = module.get<AccountWorkoutsService>(AccountWorkoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
