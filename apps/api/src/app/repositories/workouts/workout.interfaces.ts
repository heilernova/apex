import { DateISOString } from '@app/schemas/common';
import { WorkoutContent, WorkoutType } from '@app/schemas/workouts';
import { OmitBy, PartialWithout } from '@app/shared';

export interface IWorkout {
  id: string;
  createdAt: DateISOString;
  updatedAt: DateISOString;
  published: boolean;
  editable: boolean;
  gymId: string | null;
  name: string;
  description: string | null;
  type: WorkoutType;
  timeCap: number | null;
  scoreOrder: 'asc' | 'desc' | null;
  difficulty: number;
  disciplines: string[];
  content: WorkoutContent;
  slug: string;
  seo: {
    title: string | null;
    description: string | null;
    keywords: string[] | null;
    openGraphImages: { [key: string]: string }[];
  }
  images: string[];
}


export interface IWorkoutCreate extends PartialWithout<OmitBy<IWorkout, 'id' | 'createdAt' | 'updatedAt' | 'seo'>,
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

export interface IWorkoutUpdate extends  Partial<OmitBy<IWorkout, 'id' | 'createdAt' | 'updatedAt' | 'seo'>> {
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
    openGraphImages?: { [key: string]: string }[];
  }
}
