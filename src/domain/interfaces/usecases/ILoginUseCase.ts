import { AuthResult } from '../../entities/AuthResult';
import { LoginParams } from '../repositories/LoginParams';

export interface ILoginUseCase {
  execute(params: LoginParams): Promise<AuthResult>;
}
