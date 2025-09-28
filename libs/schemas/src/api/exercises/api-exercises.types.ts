import { RMType } from '../../types';

export type ApiExercise = {
  id: string; // Identificador único del ejercicio
  createdAt: string; // Marca de tiempo ISO de cuando se creó el ejercicio
  updatedAt: string; // Marca de tiempo ISO de cuando se actualizó por última vez el ejercicio
  published: boolean; // Indica si el ejercicio está publicado
  name: string; // Nombre del ejercicio
  slug: string; // Slug para URLs
  allowedRmTypes: RMType[];
  description: string | null; // Descripción del ejercicio
  tags: string[]; // Etiquetas asociadas al ejercicio
  primaryMuscleGroups: string[]; // Grupos musculares primarios
  videos: { url: string; platform: string }[]; // Videos del ejercicio
  seo: {
    title: string | null; // Título SEO
    description: string | null; // Descripción SEO
    keywords: string[]; // Palabras clave SEO
    openGraphImages: string[]; // Imágenes Open Graph
  }
  images: string[]; // Imágenes del ejercicio
}

export interface ApiExerciseUpdateBody {
  name: string; // Nombre del ejercicio
  allowedRmTypes?: RMType[];
  description?: string | null; // Descripción del ejercicio
  tags?: string[]; // Etiquetas asociadas al ejercicio
  primaryMuscleGroups?: string[]; // Grupos musculares primarios
  videos?: { url: string; platform: string }[]; // Videos del ejercicio
  seoTitle?: string | null; // Título SEO
  seoDescription?: string | null; // Descripción SEO
  seoKeywords?: string[]; // Palabras clave SEO
}

export interface ApiExercisesGetAllResponse {
  data: ApiExercise[];
}

export interface ApiExercisesUpdateResponse {
  data: ApiExercise;
}
export interface ApiExercisesCreateResponse {
  data: ApiExercise;
}