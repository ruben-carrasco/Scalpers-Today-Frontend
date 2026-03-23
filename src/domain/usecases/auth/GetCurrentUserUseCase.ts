import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IGetCurrentUserUseCase } from '../../interfaces/usecases/IGetCurrentUserUseCase';
import { IAuthRepository } from '../../interfaces/repositories/IAuthRepository';
import { User } from '../../entities/User';

@injectable()
export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    @inject(TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {}

  async execute(): Promise<User | null> {
    const token = await this.authRepository.getStoredToken();
    if (!token) return null;

    try {
      return await this.authRepository.getCurrentUser();
    } catch {
      await this.authRepository.setStoredToken(null);
      return null;
    }
  }
}
