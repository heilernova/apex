import { PostgresInterval } from "../types";
import { RMType } from "../types/exercise.types";

export interface DbExercise {
  id: string; // Identificador único del ejercicio
  created_at: Date; // Marca de tiempo ISO de cuando se creó el ejercicio
  updated_at: Date; // Marca de tiempo ISO de cuando se actualizó por última vez el ejercicio
  published: boolean; // Indica si el ejercicio está publicado
  name: string; // Nombre del ejercicio
  slug: string; // Slug para URLs
  allowed_rm_types: RMType[];
  description: string | null; // Descripción del ejercicio
  tags: string[]; // Etiquetas asociadas al ejercicio
  primary_muscle_groups: string[]; // Grupos musculares primarios
  videos: { url: string; platform: string }[]; // Videos del ejercicio
  seo_title: string | null; // Título SEO
  seo_description: string | null; // Descripción SEO
  seo_keywords: string[]; // Palabras clave SEO
  seo_open_graph_images: string[]; // Imágenes Open Graph
  images: string[]; // Imágenes del ejercicio
}

export interface DbExerciseInsert {
  published?: boolean; // Indica si el ejercicio está publicado
  name: string; // Nombre del ejercicio
  slug: string; // Slug para URLs
  allowed_rm_types?: RMType[];
  description?: string | null; // Descripción del ejercicio
  tags?: string[]; // Etiquetas asociadas al ejercicio
  primary_muscle_groups?: string[]; // Grupos musculares primarios
  videos?: { url: string; platform: string }[]; // Videos del ejercicio
  seo_title?: string | null; // Título SEO
  seo_description?: string | null; // Descripción SEO
  seo_keywords?: string[]; // Palabras clave SEO
}

export interface DbExerciseUpdate {
  published?: boolean; // Indica si el ejercicio está publicado
  name?: string; // Nombre del ejercicio
  slug?: string; // Slug para URLs
  allowed_rm_types?: RMType[]; 
  description?: string | null; // Descripción del ejercicio
  tags?: string[]; // Etiquetas asociadas al ejercicio
  primary_muscle_groups?: string[]; // Grupos musculares primarios
  videos?: { url: string; platform: string }[]; // Videos del ejercicio
  seo_title?: string | null; // Título SEO
  seo_description?: string | null; // Descripción SEO
  seo_keywords?: string[]; // Palabras clave SEO
  seo_open_graph_images?: string[]; // Imágenes Open Graph
  images?: string[]; // Imágenes del ejercicio
}

export interface DbExerciseRM {
  id: string; // Identificador único del RM
  created_at: Date; // Marca de tiempo ISO de cuando se creó el RM
  exercise_id: string; // Referencia al ejercicio
  rm_type: RMType; // Tipo de RM (e.g., '1RM', '3RM', '5RM')
  weight: number | null; // Peso levantado
  reps: number | null; // Repeticiones realizadas
  time: PostgresInterval | null; // Tiempo tomado (si aplica)
  target_reps: number | null; // Repeticiones objetivo (si aplica)
  target_time: PostgresInterval | null; // Tiempo objetivo (si aplica)
  notes: string | null; // Notas adicionales
}

export interface DbExerciseRMInsert {
  exercise_id: string; // Referencia al ejercicio
  rm_type: RMType; // Tipo de RM (e.g., '1RM', '3RM', '5RM')
  weight: number | null; // Peso levantado
  reps: number | null; // Repeticiones realizadas
  time: PostgresInterval | null; // Tiempo tomado (si aplica)
  target_reps: number | null; // Repeticiones objetivo (si aplica)
  target_time: PostgresInterval | null; // Tiempo objetivo (si aplica)
  notes?: string | null; // Notas adicionales
}