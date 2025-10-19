import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Validator } from 'class-validator';
import { AuthSession } from './auth-session';
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorator';
import { AuthSessionDto } from './auth-session.dto';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _reflector: Reflector
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization ?? null;
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    let authSession: AuthSession | null = null;

    const isPublic = this._reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    
    if (!token) {
      throw new UnauthorizedException({ message: 'No se ha proporcionado un token de autenticación' });
    }

    try {
      const payload = await this._jwtService.verifyAsync(token);
      const validator = new Validator();
      const authSessionDto = new AuthSessionDto();
      Object.assign(authSessionDto, payload);
      validator.validateSync(authSessionDto);
      authSession = new AuthSession(payload);
      request['session'] = authSession
    } catch {
      throw new UnauthorizedException({ message: 'Token de autenticación inválido o expirado' });
    }

    const requiredRoles = this._reflector.getAllAndOverride<string[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles) {
      const hasRole = requiredRoles.some((role) => authSession.role === role);
  
      if (!hasRole) {
        throw new ForbiddenException({
          message: `No tienes permisos para acceder a este recurso, necesitas uno de estos roles: ${requiredRoles.join(', ')}`
        });
      }
    }

    return true;
  }
}
