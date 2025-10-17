import { UserGender } from '@app/schemas/users';
import { BaseResponse } from '../common';

export interface ApiAthleteInfo {
  id: string;
  verified: boolean;
  name: string;
  nationality: string;
  category: string;
  gender: UserGender;
  isCoach: boolean;
  judgeLevel: string | null;
  height: number; // in cm
  weight: number; // in kg
  age: number;
  socialMedia: { [key: string]: string };
  disciplines: string[];
  avatar: string | null;
  location: {
    id: string;
    name: string;
  };
  gym: {
    id: string;
    name: string;
    role: string;
    slug: string;
    status: string;
    joinedDate: string;
  } | null;
}

export interface GetAllAthletesQueryParams {
  limit?: number;
  isCoach?: boolean;
  category?: string;
  locationId?: string;
  search?: string;
}

export interface AthletesListResponseApi extends BaseResponse {
  data: ApiAthleteInfo[];
}