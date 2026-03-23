import { AuthResult } from '../../entities/AuthResult';
import { RegisterParams } from '../repositories/RegisterParams';

export interface IRegisterUseCase {
  execute(params: RegisterParams): Promise<AuthResult>;
}
