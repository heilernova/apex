import { UserRole } from '@app/schemas/users';

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