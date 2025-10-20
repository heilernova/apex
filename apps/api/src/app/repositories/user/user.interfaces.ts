import { AthleteCategory, JudgeLevel } from '@app/schemas/common';
import { UserGender, UserRole, UserStatus } from '@app/schemas/users';
import { OmitBy, PartialBy } from '@app/shared';

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  verified: boolean;
  role: UserRole;
  status: UserStatus;
  isCoach: boolean;
  judgeLevel: JudgeLevel | null;
  email: {
    address: string;
    verified: boolean;
  };
  cellphone: {
    number: string;
    verified: boolean;
  };
  jwtSecret: string;
  passwordHash: string;
  username: string;
  firstName: string;
  lastName: string;
  alias: string | null;
  gender: UserGender;
  birthdate: Date;
  age: number;
  height: number; // in cm
  weight: number; // in kg
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
  gym: {
    id: string;
    name: string;
    role: string;
    slug: string;
    joinedDate: Date;
  } | null;
}

export interface IUserCreate extends PartialBy<OmitBy<IUser, 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'email' | 'cellphone' | 'gym' | 'age' | 'location'>,
  | 'id'
  | 'verified'
  | 'role'
  | 'isCoach'
  | 'judgeLevel'
  | 'alias'
  | 'socialMedia'
  | 'avatar'
  | 'cover'
  | 'athletePhoto'
  | 'disciplines'
> {
  email: string;
  cellphone: string;
  password: string;
  locationId: string;
}


export interface IUserUpdate extends Partial<OmitBy<IUser, 'id' | 'createdAt' | 'email' | 'cellphone' | 'gym' | 'age' | 'location'>> {
  email?: string;
  cellphone?: string;
  password?: string;
  locationId?: string;
  jwtSecret?: string;
  status?: UserStatus;
  permissions?: string[];
}
