import { PasswordResetResult } from '../repositories/PasswordResetResult';
import { RequestPasswordResetParams } from '../repositories/RequestPasswordResetParams';

export interface IRequestPasswordResetUseCase {
  execute(params: RequestPasswordResetParams): Promise<PasswordResetResult>;
}
