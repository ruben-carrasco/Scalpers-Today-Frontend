import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IRequestPasswordResetUseCase } from '../../interfaces/usecases/IRequestPasswordResetUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { PasswordResetResult } from '../../interfaces/repositories/PasswordResetResult';
import { RequestPasswordResetParams } from '../../interfaces/repositories/RequestPasswordResetParams';

@injectable()
export class RequestPasswordResetUseCase implements IRequestPasswordResetUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(params: RequestPasswordResetParams): Promise<PasswordResetResult> {
    return this.authRepository.requestPasswordReset(params);
  }
}
