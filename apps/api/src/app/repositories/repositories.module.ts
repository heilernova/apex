import { Global, Module } from '@nestjs/common';
import { GeoRepository } from './geo/geo.repository';
import { UserRepository } from './user/user.repository';

const repositories = [
  GeoRepository,
  UserRepository
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
