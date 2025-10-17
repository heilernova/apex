export const ATHLETE_CATEGORIES = ['beginner', 'intermediate', 'advanced', 'rx', 'elite', 'master'] as const;
export type AthleteCategory = typeof ATHLETE_CATEGORIES[number];
