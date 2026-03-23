
import { User } from '../../domain/entities/User';

export interface UserModel extends User {
  isLoading: boolean;
  displayName: string;
  initials: string;
}

export function createUserModel(user: User): UserModel {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return {
    ...user,
    isLoading: false,
    displayName: user.name || user.email,
    initials,
  };
}
