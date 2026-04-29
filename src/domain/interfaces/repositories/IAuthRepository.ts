import { User } from '../../entities/User';
import { AuthResult } from '../../entities/AuthResult';
import { GoogleLoginParams } from './GoogleLoginParams';
import { LoginParams } from './LoginParams';
import { RegisterParams } from './RegisterParams';

export interface IAuthRepository {
  login(params: LoginParams): Promise<AuthResult>;
  googleLogin(params: GoogleLoginParams): Promise<AuthResult>;
  register(params: RegisterParams): Promise<AuthResult>;
  getCurrentUser(): Promise<User>;
  logout(): Promise<void>;
  getStoredToken(): Promise<string | null>;
  setStoredToken(token: string | null): Promise<void>;
}
