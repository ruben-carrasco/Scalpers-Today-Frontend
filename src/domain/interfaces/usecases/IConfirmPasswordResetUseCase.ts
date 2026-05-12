import { ConfirmPasswordResetParams } from '../repositories/ConfirmPasswordResetParams';
import { PasswordResetResult } from '../repositories/PasswordResetResult';

export interface IConfirmPasswordResetUseCase {
  execute(params: ConfirmPasswordResetParams): Promise<PasswordResetResult>;
}
