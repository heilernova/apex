import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthSession } from '../model/auth-session';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    let authSession: AuthSession;


    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
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
      const payload: JwtPayload = await this._jwtService.verifyAsync(token);
      authSession = new AuthSession(payload);
      request['session'] = authSession
    } catch {
      throw new UnauthorizedException({ message: 'Token de autenticación inválido o expirado' });
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[] | undefined>(ROLES_KEY, [
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

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization ?? null;
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
