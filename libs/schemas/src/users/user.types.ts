export const USER_STATUS = ['active', 'inactive', 'blocked', 'banned'] as const;
export type UserStatus = typeof USER_STATUS[number];

export const USER_ROLES = ['admin', 'collaborator', 'user'] as const;
export type UserRole = typeof USER_ROLES[number];

export const USER_GENDERS = ['M', 'F'] as const;
export type UserGender = typeof USER_GENDERS[number];