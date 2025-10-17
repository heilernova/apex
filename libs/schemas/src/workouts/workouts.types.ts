import { AthleteCategory } from "../common";

export const WORKOUT_TYPES = ['AMRAP', 'EMOM', 'RFT', 'TABATA', 'BENCHMARK', 'FOR_TIME', 'STRENGTH', 'CHIPPER', 'LADDER'] as const;
export type WorkoutType = typeof WORKOUT_TYPES[number];

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

export  interface IWorkout {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  name: string;
  difficulty: AthleteCategory;
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
