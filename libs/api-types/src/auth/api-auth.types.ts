import { AthleteCategory } from '@app/schemas/common';
import { UserGender, UserRole } from '@app/schemas/users';

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface AccessData {
  accessToken: string;
  refreshToken: string;
  sessionInfo: {
    role: UserRole;
    isCoach: boolean;
    isJudge: boolean;
    permissions: string[];
    name: string;
  }
}

export interface LoginResponseBody {
  data: AccessData;
}

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface RefreshTokenResponseBody {
  data: AccessData;
}

export interface VerifySessionResponse {
  data: AccessData | null;
}

export interface RegisterRequestBody {
  email: string
  username: string;
  cellphone: string;
  password: string;

  firstName: string;
  lastName: string;
  alias?: string | null;
  gender: UserGender;
  birthdate: string; // ISO date string
  height: number; // in cm
  weight: number; // in kg
  nationality: string;

  locationId: string;
  category: AthleteCategory;
}