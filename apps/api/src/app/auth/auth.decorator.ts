import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@app/schemas/users';
import { Session } from './auth-session';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

/**
 * Decorador para requerir roles específicos
 * @param roles - Lista de roles permitidos
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);


/**
 * Marca una ruta como pública (sin necesidad de autenticación)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Decorador para obtener la sesión actual desde el request
 */
export const CurrentSession = createParamDecorator(
  (data: keyof Session | undefined, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;
    if (session instanceof Session) {
      return session;
    }
    
    throw new Error('La sesión no está disponible en el request, puede que el middleware no esté configurado correctamente.');
  },
);
