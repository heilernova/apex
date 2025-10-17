import { OmitBy, PartialBy } from '@app/shared';
import { AthleteCategory, JudgeLevel } from '../common';
import { UserGender, UserRole, UserStatus } from './user.types';

export interface UserDb {
  id: string;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
  status: UserStatus;
  role: UserRole;
  is_coach: boolean;
  judge_level: JudgeLevel | null;
  verified: boolean;
  category: AthleteCategory;
  email_address: string;
  email_verified: boolean;
  cellphone_number: string;
  cellphone_verified: boolean;
  username: string;
  alias: string | null;
  first_name: string;
  last_name: string;
  gender: UserGender;
  birthdate: Date;
  height: number;
  weight: number;
  location_id: string;
  nationality: string;
  disciplines: string[];
  jwt_secret: string;
  social_media: { [key: string]: string };
  password_hash: string;
  permissions: string[];
  avatar: string | null;
  cover: string | null;
  athlete_photo: string | null;
}


export type NewUserDb = PartialBy<OmitBy<UserDb, 'created_at'  | 'updated_at' | 'last_login_at' | 'verified'>,
  | 'id'
  | 'judge_level'
  | 'email_verified'
  | 'cellphone_verified'
  | 'alias'
  | 'avatar'
  | 'cover'
  | 'athlete_photo'
  | 'social_media'
  | 'category'
  | 'jwt_secret'
  | 'role'
  | 'permissions'
  | 'status'
  | 'disciplines'
>;

export type UpdateUserDb = Partial<OmitBy<UserDb, 'created_at' | 'updated_at' | 'id'>>;