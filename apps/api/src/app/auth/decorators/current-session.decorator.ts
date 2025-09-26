import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthSession } from '../model/auth-session';


/**
 * Decorador para obtener la sesión actual desde el request
 */
export const CurrentSession = createParamDecorator(
  (data: keyof AuthSession | undefined, ctx: ExecutionContext): AuthSession => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;
    if (session instanceof AuthSession) {
      return session;
    }
    
    throw new Error('La sesión no está disponible en el request, puede que el middleware no esté configurado correctamente.');
  },
);