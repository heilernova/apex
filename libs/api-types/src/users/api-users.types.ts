import { AthleteCategory, JudgeLevel } from '@app/schemas/common';
import { UserGender, UserRole, UserStatus } from '@app/schemas/users';
import { BaseResponse } from '../common';

export interface ApiUserInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  status: UserStatus;
  role: UserRole;
  isCoach: boolean;
  judgeLevel: JudgeLevel | null;
  verified: boolean;
  email: {
    address: string;
    verified: boolean;
  };
  cellphone: {
    number: string;
    verified: boolean;
  };
  username: string;
  alias: string | null;
  firstName: string;
  lastName: string;
  gender: UserGender;
  birthdate: string;
  age: number;
  height: number;
  weight: number;
  nationality: string;
  category: AthleteCategory;
  location: {
    id: string;
    name: string;
  };
  disciplines: string[];
  socialMedia: { [key: string]: string };
  avatar: string | null;
  cover: string | null;
  athletePhoto: string | null;
  gym?: {
    id: string;
    name: string;
    role: string;
    status: string;
    joinedDate: string;
  } | null;
}

export interface GetAllAccountQueryParams {
  limit?: number;
  role?: UserRole;
  judgeLevel?: JudgeLevel;
  status?: UserStatus;
  isCoach?: boolean;
  category?: AthleteCategory;
  locationId?: string;
  search?: string;
}

export interface GetAllAccountsResponse extends BaseResponse {
  data: ApiUserInfo[];
}

export interface UpdateAccountRequestBody {
  email?: string;
  cellphone?: string;
  category?: AthleteCategory;
  firstName?: string;
  lastName?: string;
  alias?: string | null;
  height?: number;
  weight?: number;
  locationId?: string;
  nationality?: string;
  verified?: boolean;
}

export interface UpdateStatusAccountRequestBody {
  status: UserStatus;
}
