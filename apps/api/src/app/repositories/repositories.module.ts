import { Global, Module } from '@nestjs/common';
import { DatabaseRepository } from './database';
import { GeoRepository } from './geo/geo.repository';
import { UserRepository } from './user';
import { ExerciseRepository } from './exercises';
import { WorkoutRepository } from './workouts';

const repositories = [
  DatabaseRepository,
  GeoRepository,
  UserRepository,
  ExerciseRepository,
  WorkoutRepository
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
