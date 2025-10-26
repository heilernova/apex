/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { DateISOString } from '@app/schemas/common';
import { RmType } from '@app/schemas/exercises';
import { OmitBy, PartialWithout } from '@app/shared';

export interface IExercise {
  id: string;
  createdAt: DateISOString;
  updatedAt: DateISOString;
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
  };
  images: string[];
}

export interface IExerciseCreate extends PartialWithout<OmitBy<IExercise, "id" | "createdAt" | "updatedAt" | "published" | "slug">,
  "name"
> {}

export interface IExerciseUpdate extends Partial<OmitBy<IExercise, "id" | "createdAt" | "updatedAt">> {}
