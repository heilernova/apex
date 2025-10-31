import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth';
import { ConfigModule } from './config';
import { RepositoriesModule } from './repositories/repositories.module';
import { AuthModule } from './resources/auth/auth.module';
import { AccountModule } from './resources/account/account.module';
import { UsersModule } from './resources/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || crypto.randomUUID(),
      signOptions: { expiresIn: '8h' },
    }),
    ConfigModule,
    RepositoriesModule,
    AuthModule,
    AccountModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
