import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './resources/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './resources/account/account.module';
import { AccountsModule } from './resources/accounts/accounts.module';
import { CountryExistsValidator } from './common/validators/country-exists.validator';
import { CityExistsValidator } from './common/validators/city-exists.validator';
import {
  EmailUniqueValidator,
  UsernameUniqueValidator,
} from './common/validators';
import { ExercisesModule } from './resources/exercises/exercises.module';
import { GeoModule } from './resources/geo/geo.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '8h' },
    }),
    AuthModule,
    DatabaseModule,
    AccountModule,
    AccountsModule,
    ExercisesModule,
    GeoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    CountryExistsValidator,
    CityExistsValidator,
    EmailUniqueValidator,
    UsernameUniqueValidator,
  ],
})
export class AppModule {}
