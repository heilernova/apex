/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { OmitBy } from '@app/shared';
import { RmType } from './exercises.types';

export interface IExercises {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  name: {
    es: string;
    en: string;
  };
  slug: string;
  allowedRmTypes: RmType[];
  description: string | null;
  tags: string[];
  muscleGroups: string[];
  videos: { platform: string; url: string; title: string | null }[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string[];
    openGraphImages: unknown[];
  };
  images: string[];
}


export interface IExercisesInsert extends OmitBy<IExercises, 'id' | 'createdAt' | 'updatedAt' | 'images' | 'seo'> {
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
  };
}

export interface IExercisesUpdate extends Partial<OmitBy<IExercises, 'id' | 'createdAt'>> {}