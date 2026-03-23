import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { ILogoutUseCase } from '../../interfaces/usecases/ILogoutUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';

@injectable()
export class LogoutUseCase implements ILogoutUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
    await this.authRepository.setStoredToken(null);
  }
}
