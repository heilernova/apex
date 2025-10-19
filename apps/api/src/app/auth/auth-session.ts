import { JudgeLevel } from '@app/schemas/common';
import { UserGender, UserRole } from '@app/schemas/users';
import { JwtPayload } from './auth.interfaces';

export class AuthSession {
  public readonly id: string;
  public readonly isCoach: boolean;
  public readonly role: UserRole;
  public readonly judgeLevel: JudgeLevel | null;
  public readonly verified: boolean;
  public readonly name: string;
  public readonly gender: UserGender;
  public readonly permissions: string[];

  constructor(data: JwtPayload) {
    this.id = data.id;
    this.isCoach = data.isCoach;
    this.role = data.role;
    this.judgeLevel = data.judgeLevel ?? null;
    this.verified = data.verified;
    this.name = data.name;
    this.gender = data.gender;
    this.permissions = data.permissions;
  }
}
