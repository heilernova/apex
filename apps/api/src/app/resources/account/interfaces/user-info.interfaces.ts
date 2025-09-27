import { UserGender } from '@app/schemas/types';

export interface IUserInfo {
  username: string;
  email: string;
  cellphone: string;
  firstName: string;
  lastName: string;
  alias: string | null;
  sex: UserGender;
  birthdate: Date;
  height: number;
  weight: number;
  cityId: string;
  nationality: string;
  permissions: string[];
  isCoach: boolean;
  isJudge: boolean;
  judgeLevel: string | null;
  role: string;
  verified: boolean;
}