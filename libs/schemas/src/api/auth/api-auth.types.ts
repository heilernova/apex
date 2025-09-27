import { UserGender } from '../../types';
import { ApiResponseBase } from '../api-response';

export interface ApiAuthLoginResponse extends ApiResponseBase {
  data: {
    accessToken: string;
    refreshToken: string;
    sessionInfo: {
      role: string;
      isCoach: boolean;
      isJudge: boolean;
      permissions: string[];
      name: string;
    }
  }
}

export interface ApiAuthRegisterBody {
  email: string;
  cellphone: string;
  username: string;
  alias?: string | null;
  firstName: string;
  lastName: string;
  gender: UserGender;
  birthdate: string; // ISO 8601 date string
  height: number; // in cm
  weight: number; // in kg
  cityId: string;
  nationality: string; // ISO alpha-2 country code
  password: string;
}