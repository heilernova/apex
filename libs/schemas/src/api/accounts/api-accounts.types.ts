import { JudgeLevel, UserGender, UserRole } from './../../types';

export interface IApiAccountSchema {
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
  };
  physical: {
    height: number;
    weight: number;
  };
  location: {
    cityId: string;
    nationality: string;
  };
  roles: {
    permissions: string[];
    isCoach: boolean;
    isJudge: boolean;
    judgeLevel: JudgeLevel | null;
    role: UserRole;
  };
  verified: boolean;
}

export interface IApiAccountsGetAllResponse { 
  data: {
    total: number;
    accounts: IApiAccountSchema[];
  };
}