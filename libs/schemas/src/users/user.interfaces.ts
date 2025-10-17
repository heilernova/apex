import { OmitBy, PartialBy } from '@app/shared';
import { JudgeLevel } from '../common';
import { UserGender, UserRole, UserStatus } from './user.types';

export interface IUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
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
  birthdate: Date;
  age: number;
  height: number;
  weight: number;
  nationality: string;
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
    joinedDate: Date;
  } | null;
}

export interface IUserCreate extends PartialBy<OmitBy<IUser, 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'verified' | 'age' | 'location' | 'gym' | 'email' | 'cellphone' | 'avatar' | 'cover' | 'athletePhoto'>, 'alias' | 'id' | 'isCoach' | 'judgeLevel' | 'role' | 'status' | 'socialMedia'> {
  email: string;
  cellphone: string;
  password?: string;
  locationId: string;
}

export interface IUserUpdate extends Partial<OmitBy<IUser, 'createdAt' | 'updatedAt' | 'id' | 'age' | 'location' | 'gym' | 'email' | 'cellphone'>> {
  email?: string;
  cellphone?: string;
  locationId?: string;
  password?: string;
}