import { User } from '../../entities/User';
import { AuthResult } from '../../entities/AuthResult';
import { ConfirmPasswordResetParams } from './ConfirmPasswordResetParams';
import { GoogleLoginParams } from './GoogleLoginParams';
import { LoginParams } from './LoginParams';
import { PasswordResetResult } from './PasswordResetResult';
import { RegisterParams } from './RegisterParams';
import { RequestPasswordResetParams } from './RequestPasswordResetParams';

export interface IAuthRepository {
  login(params: LoginParams): Promise<AuthResult>;
  googleLogin(params: GoogleLoginParams): Promise<AuthResult>;
  register(params: RegisterParams): Promise<AuthResult>;
  requestPasswordReset(params: RequestPasswordResetParams): Promise<PasswordResetResult>;
  confirmPasswordReset(params: ConfirmPasswordResetParams): Promise<PasswordResetResult>;
  getCurrentUser(): Promise<User>;
  logout(): Promise<void>;
  getStoredToken(): Promise<string | null>;
  setStoredToken(token: string | null): Promise<void>;
}
