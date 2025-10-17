import { WorkoutContent, WorkoutType } from '@app/schemas/workouts';
export interface ApiWorkoutInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  name: string;
  description: string | null;
  type: WorkoutType;
  timeCap: unknown | null; // in seconds
  scoreOrder: 'asc' | 'desc';
  slug: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string[];
    openGraphImages: unknown[];
  }
  disciplines: string[];
  difficulty: number;
  content: WorkoutContent;
  images: string[];
}

export interface CreateWorkoutRequestBody {
  name: string;
  description?: string;
  type: string;
  timeCap?: number; // in seconds
  scoreOrder: 'asc' | 'desc';
  disciplines: string[];
  difficulty: number;
  content: WorkoutContent;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  }
}

export interface UpdateWorkoutRequestBody {
  name?: string;
  description?: string;
  type?: string;
  timeCap?: number; // in seconds
  scoreOrder?: 'asc' | 'desc';
  disciplines?: string[];
  difficulty?: number;
  content?: WorkoutContent;
}
export interface WorkoutsListResponseApi {
  data: ApiWorkoutInfo[];
}