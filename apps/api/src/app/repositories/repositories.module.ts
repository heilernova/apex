import { Global, Module } from '@nestjs/common';
import { DatabaseRepository } from './database';
import { GeoRepository } from './geo/geo.repository';
import { UserRepository } from './user';

const repositories = [
  DatabaseRepository,
  GeoRepository,
  UserRepository
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
