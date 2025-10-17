import { AthleteCategory, JudgeLevel } from "@app/schemas/common";

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