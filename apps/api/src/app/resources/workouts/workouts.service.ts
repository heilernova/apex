import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from '../../repositories/workouts';

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly _workoutRepository: WorkoutRepository,
  ) {}


  async findAll() {
    return {
      data: await this._workoutRepository.getAll(),
    };
  }

  async findOne(val: string) {
    return {
      data: await this._workoutRepository.getBySlug(val),
    };
  }

}
