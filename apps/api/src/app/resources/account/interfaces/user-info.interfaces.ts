import { JudgeLevel, UserGender } from '@app/schemas/types';

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
  judgeLevel: JudgeLevel | null;
  role: string;
  verified: boolean;
}