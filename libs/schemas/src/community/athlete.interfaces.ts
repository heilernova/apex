import { AthleteCategory, JudgeLevel } from '../common';
import { UserGender } from '../users';

export interface IAthlete {
  id: string;
  verified: boolean;
  name: string;
  nationality: string;
  category: AthleteCategory;
  gender: UserGender;
  isCoach: boolean;
  judgeLevel: JudgeLevel | null;
  height: number;
  weight: number;
  age: number;
  socialMedia: unknown;
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
