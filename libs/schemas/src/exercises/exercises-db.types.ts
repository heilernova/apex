import { OmitBy, PartialBy } from '@app/shared';
import { RmType } from './exercises.types';

export interface ExercisesDb {
  id: string;
  created_at: Date;
  updated_at: Date;
  published: boolean;
  name_es: string;
  name_en: string;
  slug: string;
  allowed_rm_types: RmType[];
  description: string | null;
  tags: string[];
  muscle_groups: string[];
  videos: { platform: string; url: string; title: string | null }[];
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  seo_open_graph_images: unknown[];
  images: string[];
}

export type ExercisesDbInsert = PartialBy<OmitBy<
  ExercisesDb,
  | "created_at"
  | "updated_at"
>
  ,'id'
  | 'tags'
  | 'muscle_groups'
  | 'videos'
  | 'seo_title'
  | 'seo_description'
  | 'seo_keywords'
  | 'seo_open_graph_images'
  | 'images'
>;

export type ExercisesDbUpdate = Partial<OmitBy<ExercisesDb, 'id' | 'created_at'>>;