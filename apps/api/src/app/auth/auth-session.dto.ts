import { IsBoolean, IsIn, IsString, IsUUID } from 'class-validator';
import { USER_GENDERS, USER_ROLES, UserGender, UserRole } from '@app/schemas/users/user.types';
import { JUDGE_LEVELS, JudgeLevel } from '@app/schemas/common';
import { JwtPayload } from './auth.interfaces';

export class AuthSessionDto implements JwtPayload {
  @IsUUID()
  public readonly id!: string;

  @IsBoolean()
  public readonly isCoach!: boolean;

  @IsIn(USER_ROLES)
  public readonly role!: UserRole;

  @IsIn(JUDGE_LEVELS)
  public readonly judgeLevel!: JudgeLevel | null;

  @IsBoolean()
  public readonly verified!: boolean;

  @IsString()
  public readonly name!: string;

  @IsIn(USER_GENDERS)
  public readonly gender!: UserGender;


  @IsString({ each: true })
  public readonly permissions!: string[];
}
