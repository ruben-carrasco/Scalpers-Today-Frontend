import { User } from './User';
import { AuthToken } from './AuthToken';

export interface AuthResult {
  user: User;
  token: AuthToken;
}
