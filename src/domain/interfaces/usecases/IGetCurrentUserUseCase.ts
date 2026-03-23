import { User } from '../../entities/User';

export interface IGetCurrentUserUseCase {
  execute(): Promise<User | null>;
}
