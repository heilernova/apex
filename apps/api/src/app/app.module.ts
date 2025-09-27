import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './resources/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '8h' },
    }),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useValue: AuthGuard }],
})
export class AppModule {}
