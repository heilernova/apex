export const GYM_TYPES = ['BOX', 'GYM'] as const;
export type GymType = typeof GYM_TYPES[number];

export const GYM_STATUSES = ['active', 'inactive', 'closed'] as const;
export type GymStatus = typeof GYM_STATUSES[number];

export const GYM_MEMBER_ROLES = ['admin', 'coach', 'member'] as const;
export type GymMemberRole = typeof GYM_MEMBER_ROLES[number];

export const GYM_MEMBER_STATUSES = ['active', 'inactive', 'suspended'] as const;
export type GymMemberStatus = typeof GYM_MEMBER_STATUSES[number];