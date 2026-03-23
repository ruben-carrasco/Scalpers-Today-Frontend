import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { ILoginUseCase } from '../../interfaces/usecases/ILoginUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { LoginParams } from '../../interfaces/repositories/LoginParams';
import { AuthResult } from '../../entities/AuthResult';

@injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(params: LoginParams): Promise<AuthResult> {
    const result = await this.authRepository.login(params);
    await this.authRepository.setStoredToken(result.token.accessToken);
    return result;
  }
}
