import { UserGender, UserRole } from '@app/schemas/types';

export interface JwtPayload {
  id: string;
  isCoach: boolean;
  role: UserRole;
  isJudge: boolean;
  verified: boolean;
  name: string;
  gender: UserGender;
  permissions: string[];
}