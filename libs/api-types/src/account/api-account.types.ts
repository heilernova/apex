import { AthleteCategory, JudgeLevel } from "@app/schemas/common";
import { UserRole } from "@app/schemas/users";

export interface AccountInfo {
  username: string;
  verified: boolean;
  email: {
    address: string;
    verified: boolean;
  };
  cellphone: {
    number: string;
    verified: boolean;
  };

  firstName: string;
  lastName: string;
  alias?: string | null;
  gender: string;
  birthdate: string; // ISO date string
  age: number;
  height: number; // in cm
  weight: number; // in kg
  nationality: string;
  locationId: string;
  
  judgeLevel: JudgeLevel | null;
  category: AthleteCategory;
}

export interface UpdateAccountRequestBody {
  username?: string;
  email?: string;
  cellphone?: string;
  firstName?: string;
  lastName?: string;
  alias?: string | null;
  height?: number;
  weight?: number;
  locationId?: string;
  nationality?: string;
}

export interface UpdatePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface ApiLoginResponse { 
  data: {
    accessToken: string;
    refreshToken: string;
    sessionInfo: {
      name: string;
      role: UserRole;
      gender: string;
      isCoach: boolean;
      judgeLevel: JudgeLevel | null;
      permissions: string[];
      verified: boolean;
    };
  };
}
export interface ApiRefreshResponse { 
  data: {
    accessToken: string;
    refreshToken: string;
    sessionInfo: {
      name: string;
      role: UserRole;
      gender: string;
      isCoach: boolean;
      judgeLevel: JudgeLevel | null;
      permissions: string[];
      verified: boolean;
    };
  };
}
