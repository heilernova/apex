import { Global, Module } from '@nestjs/common';
import { DatabaseRepository } from './database';
import { GeoRepository } from './geo/geo.repository';

const repositories = [
  DatabaseRepository,
  GeoRepository
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
