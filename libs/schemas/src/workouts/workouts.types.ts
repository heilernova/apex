import { OmitBy, PartialWithout } from "@app/shared";
import { AthleteCategory } from "../common";

export const WORKOUT_TYPES = ['AMRAP', 'EMOM', 'RFT', 'TABATA', 'BENCHMARK', 'FOR_TIME', 'STRENGTH', 'CHIPPER', 'LADDER', ] as const;
export type WorkoutType = typeof WORKOUT_TYPES[number];

export const WORKOUT_STATUS = ['draft', 'published', 'archived'] as const;
export type WorkoutStatus = typeof WORKOUT_STATUS[number];

export interface WorkoutContent {
  header?: string;
  exercise?: {
    description: string;
    weight?: {
      men: number;
      women: number;
    }
  }[];
  videoUrl?: string;
  notes?: string;
}

export interface IWorkoutContent {
  header?: string;
  exercise?: {
    description: string;
    weight?: {
      men: number;
      women: number;
    }
  }[];
  videoUrl?: string;
  notes?: string;
}

export  interface IWorkout {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: WorkoutStatus;
  editable: boolean;
  name: string;
  difficulty: number;
  description: string | null;
  type: WorkoutType;
  timeCap: unknown | null; // in seconds
  keywords: string[];
  scoreOrder: 'asc' | 'desc' | null;
  slug: string;
  disciplines: string[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string[];
    openGraphImages: unknown[];
  }
  content: WorkoutContent;
  authors: {
    id: string;
    username: string;
    name: string;
    avatar: string | null;
  }[]
}

export interface IWorkoutCreate extends PartialWithout<OmitBy<IWorkout, 'id' | 'createdAt' | 'updatedAt' | 'seo' | 'authors'>,
  | 'name'
  | 'content'
  | 'type'
> {
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
    openGraphImages?: { [key: string]: string }[];
  }
}

export interface IWorkoutUpdate extends  Partial<OmitBy<IWorkout, 'id' | 'createdAt' | 'updatedAt' | 'seo' | 'authors'>> {
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
    openGraphImages?: { [key: string]: string }[];
  }
}


export interface CreateWorkout {
  name: string;
  description?: string;
  type: WorkoutType;
  timeCap?: unknown; // in seconds
  scoreOrder: 'asc' | 'desc';
  disciplines: string[];
  difficulty: AthleteCategory;
  content?: WorkoutContent;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface UpdateWorkout {
  name?: string;
  description?: string;
  type?: WorkoutType;
  timeCap?: unknown; // in seconds
  scoreOrder?: 'asc' | 'desc';
  disciplines?: string[];
  difficulty?: AthleteCategory;
  content?: WorkoutContent;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    openGraphImages?: unknown[];
  };
}
