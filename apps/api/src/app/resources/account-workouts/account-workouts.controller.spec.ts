import { Test, TestingModule } from '@nestjs/testing';
import { AccountWorkoutsController } from './account-workouts.controller';
import { AccountWorkoutsService } from './account-workouts.service';

describe('AccountWorkoutsController', () => {
  let controller: AccountWorkoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountWorkoutsController],
      providers: [AccountWorkoutsService],
    }).compile();

    controller = module.get<AccountWorkoutsController>(
      AccountWorkoutsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
