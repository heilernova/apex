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
  permissions: string[];
}
