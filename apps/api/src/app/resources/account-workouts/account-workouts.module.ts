import { Module } from '@nestjs/common';
import { AccountWorkoutsService } from './account-workouts.service';
import { AccountWorkoutsController } from './account-workouts.controller';

@Module({
  controllers: [AccountWorkoutsController],
  providers: [AccountWorkoutsService],
})
export class AccountWorkoutsModule {}
