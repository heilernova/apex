import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(() => {
    jwtService = new JwtService({});
    reflector = new Reflector();
    guard = new AuthGuard(jwtService, reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
