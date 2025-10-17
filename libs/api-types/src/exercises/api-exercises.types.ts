import { RmType} from '@app/schemas/exercises';
import { BaseResponse } from '../common';

export interface ExercisesInfoApi {
  id: string;
  createdAt: string;
  updatedAt: string;
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

export interface GetAllExercisesQueryParams {
  limit?: number;
  published?: boolean;
  search?: string;
}

export interface ExercisesListResponseApi extends BaseResponse {
  data: ExercisesInfoApi[];
}

export interface ExerciseCreateRequestBody {
  name: {
    es: string;
    en: string;
  },
  allowedRmTypes: RmType[];
  description?: string | null;
  tags?: string[];
  muscleGroups?: string[];
  videos?: { platform: string; url: string; title: string | null }[];
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
  };
}

export interface ExerciseUpdateRequestBody {
  data: ExercisesInfoApi;
}

export interface ExerciseUpdateRequestBody {
  name?: {
    es: string;
    en: string;
  },
  allowedRmTypes?: RmType[];
  description?: string | null;
  tags?: string[];
  muscleGroups?: string[];
  videos?: { platform: string; url: string; title: string | null }[];
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
  };
}

export interface ExerciseUpdateResponseApi {
  data: ExercisesInfoApi;
}