export const JUDGE_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;
export type JudgeLevel = typeof JUDGE_LEVELS[number];