import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGoogleLoginUseCase } from '../../interfaces/usecases/IGoogleLoginUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { GoogleLoginParams } from '../../interfaces/repositories/GoogleLoginParams';
import { AuthResult } from '../../entities/AuthResult';

@injectable()
export class GoogleLoginUseCase implements IGoogleLoginUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(params: GoogleLoginParams): Promise<AuthResult> {
    const result = await this.authRepository.googleLogin(params);
    await this.authRepository.setStoredToken(result.token.accessToken);
    return result;
  }
}
