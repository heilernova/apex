export const RM_TYPES = ['time', 'reps', 'weight'] as const;
export type RMType = (typeof RM_TYPES)[number];