/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { OmitBy, PartialBy } from "@app/shared";
import { WorkoutContent, WorkoutStatus, WorkoutType } from "./workouts.types";

export interface IWorkoutDb {
  id: string;
  created_at: Date;
  updated_at: Date;
  status: WorkoutStatus;
  editable: boolean;
  name: string;
  slug: string;
  description: string | null;
  type: WorkoutType;
  time_cap: unknown | null; // in seconds
  score_order: 'asc' | 'desc' | null;
  disciplines: string[];
  difficulty: number;
  content: WorkoutContent;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
  seo_open_graph_images: unknown[];
  images: string[];
}

export interface IWorkoutDbCreate extends PartialBy<OmitBy<IWorkoutDb,'id' | 'created_at' | 'updated_at' | 'status' | 'editable'>,
  | 'content'
  | 'description'
  | 'time_cap'
  | 'seo_title'
  | 'seo_description'
  | 'seo_keywords'
  | 'seo_open_graph_images'
  | 'images'
  | 'difficulty'
  | 'disciplines'
  | 'score_order'
> {}

export interface  IWorkoutDbUpdate extends Partial<OmitBy<IWorkoutDb, 'id' | 'created_at'>> {}
