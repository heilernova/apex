import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@app/schemas/types';


export const ROLES_KEY = 'roles';

/**
 * Decorador para requerir roles específicos
 * @param roles - Lista de roles permitidos
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);