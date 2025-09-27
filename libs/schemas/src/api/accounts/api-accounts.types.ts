import { JudgeLevel, UserGender, UserRole } from './../../types';

export interface ApiAccountSchema {
  id: string;
  username: string;
  email: {
    address: string;
    verified: boolean;
  };
  cellphone: {
    number: string;
    verified: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    alias: string | null;
    gender: UserGender;
    birthdate: Date;
    age: number;
  };
  physical: {
    height: number;
    weight: number;
  };
  location: {
    cityId: string;
    nationality: string;
  };
  access: {
    permissions: string[];
    isCoach: boolean;
    judgeLevel: JudgeLevel | null;
    role: UserRole;
  };
  verified: boolean;
}

export interface ApiAccountsGetAllResponse { 
  data: {
    total: number;
    accounts: ApiAccountSchema[];
  };
}