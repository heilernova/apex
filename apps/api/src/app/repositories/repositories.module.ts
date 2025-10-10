import { Global, Module } from '@nestjs/common';
import { GeoRepository } from './geo/geo.repository';

const repositories = [GeoRepository];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
