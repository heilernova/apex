import { JudgeLevel, UserGender } from '../../types';
import { ApiResponseBase } from '../api-response';

export interface ApiAccountInfoResponse extends ApiResponseBase {
  data: {
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
}

export interface ApiAccountUpdateBody {
  username?: string;
  email?: string;
  cellphone?: string;
  firstName?: string;
  lastName?: string;
  alias?: string | null;
  height?: number;
  weight?: number;
  cityId?: string;
  nationality?: string;
}