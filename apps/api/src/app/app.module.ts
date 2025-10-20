import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth';
import { ConfigModule } from './config';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [
    ConfigModule,
    RepositoriesModule
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
