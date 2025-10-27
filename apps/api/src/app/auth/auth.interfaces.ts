import { JudgeLevel } from '@app/schemas/common';
import { UserGender, UserRole } from '@app/schemas/users';

export interface JwtPayload {
  id: string;
  isCoach: boolean;
  role: UserRole;
  judgeLevel: JudgeLevel | null;
  verified: boolean;
  name: string;
  gender: UserGender;
  sessionKey: string;
  permissions: string[];
}

export interface RefreshTokenPayload {
  sub: string;
}
