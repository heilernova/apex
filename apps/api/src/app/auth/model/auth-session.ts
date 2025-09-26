import { UserGender, UserRole } from '@app/schemas/types';
import { JwtPayload } from '../interfaces/jwt-payload';

export class AuthSession {
  public readonly id: string;
  public readonly isCoach: boolean;
  public readonly role: UserRole;
  public readonly isJudge: boolean;
  public readonly verified: boolean;
  public readonly name: string;
  public readonly gender: UserGender;
  public readonly permissions: string[];

  constructor(data: JwtPayload) {
    this.id = data.id;
    this.isCoach = data.isCoach;
    this.role = data.role;
    this.isJudge = data.isJudge;
    this.verified = data.verified;
    this.name = data.name;
    this.gender = data.gender;
    this.permissions = data.permissions;
  }
}