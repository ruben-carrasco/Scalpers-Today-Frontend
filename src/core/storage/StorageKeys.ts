
export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  PUSH_TOKEN: 'push_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
