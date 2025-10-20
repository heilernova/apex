import { Global, Module } from '@nestjs/common';
import { DatabaseRepository } from './database';

const repositories = [
  DatabaseRepository
];

@Global()
@Module({
  providers: repositories,
  exports: repositories
})
export class RepositoriesModule {}
