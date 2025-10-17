export const RM_TYPES = ['weight', 'reps', 'time'] as const;

export type RmType = typeof RM_TYPES[number];