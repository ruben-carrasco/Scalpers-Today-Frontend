import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IConfirmPasswordResetUseCase } from '../../interfaces/usecases/IConfirmPasswordResetUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { ConfirmPasswordResetParams } from '../../interfaces/repositories/ConfirmPasswordResetParams';
import { PasswordResetResult } from '../../interfaces/repositories/PasswordResetResult';

@injectable()
export class ConfirmPasswordResetUseCase implements IConfirmPasswordResetUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(params: ConfirmPasswordResetParams): Promise<PasswordResetResult> {
    return this.authRepository.confirmPasswordReset(params);
  }
}
