export const USER_ROLES = ['admin', 'collaborator', 'user'] as const;
export const ATHLETE_CATEGORIES = ['beginner', 'intermediate', 'advanced', 'rx', 'elite', 'masters', 'teen'] as const;
export const JUDGE_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;
export const USER_GENDERS = ['M', 'F'] as const;
export const USER_STATUSES = ['active', 'inactive', 'blocked', 'banned'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type JudgeLevel = (typeof JUDGE_LEVELS)[number];
export type AthleteCategory = (typeof ATHLETE_CATEGORIES)[number];
export type UserGender = (typeof USER_GENDERS)[number];
export type UserStatus = (typeof USER_STATUSES)[number];