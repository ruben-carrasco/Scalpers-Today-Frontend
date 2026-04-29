import { AuthResult } from '../../entities/AuthResult';
import { GoogleLoginParams } from '../repositories/GoogleLoginParams';

export interface IGoogleLoginUseCase {
  execute(params: GoogleLoginParams): Promise<AuthResult>;
}
