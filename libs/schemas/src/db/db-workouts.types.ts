export interface DbWorkout {
  id: string; // Unique identifier for the workout
  created_at: Date; // ISO timestamp of when the entry was created
  updated_at: Date; // ISO timestamp of when the entry was last updated
  published: boolean; // Indicates if the workout is published
  name: string; // Name of the workout
  description: string | null; // Description of the workout
  tags: string[]; // Tags associated with the workout
  type: string; // Type of workout (e.g., 'strength', 'cardio')
  time_cap: number | null; // Time cap in seconds, if applicable
  score_order: 'asc' | 'desc'; // Score order, if applicable
  exercises: { exercise_id: string; sets: number; reps: number | null; weight: number | null; duration: number | null; rest_between_sets: number | null }[]; // Exercises included in the workout
  slug: string; // Slug for URLs
  seo_title: string | null; // SEO title for the workout page
  seo_description: string | null; // SEO description for the workout page
  seo_keywords: string[]; // SEO keywords for the workout page
  seo_open_graph_images: string[]; // Open Graph images for the workout page
  images: string[]; // Images for the workout
}