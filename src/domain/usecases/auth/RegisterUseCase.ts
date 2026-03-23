import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IRegisterUseCase } from '../../interfaces/usecases/IRegisterUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { RegisterParams } from '../../interfaces/repositories/RegisterParams';
import { AuthResult } from '../../entities/AuthResult';

@injectable()
export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(params: RegisterParams): Promise<AuthResult> {
    const result = await this.authRepository.register(params);
    await this.authRepository.setStoredToken(result.token.accessToken);
    return result;
  }
}
