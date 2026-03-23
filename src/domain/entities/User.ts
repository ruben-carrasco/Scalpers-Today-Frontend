import { UserPreferences } from './UserPreferences';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  preferences: UserPreferences;
  isVerified: boolean;
}
