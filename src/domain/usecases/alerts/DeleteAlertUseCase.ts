import { injectable, inject } from 'inversify';
import { TYPES } from '../../../core/types';
import { IDeleteAlertUseCase } from '../../interfaces/usecases/IDeleteAlertUseCase';
import { IAlertRepository } from '../../interfaces/repositories/IAlertRepository';

@injectable()
export class DeleteAlertUseCase implements IDeleteAlertUseCase {
  constructor(
    @inject(TYPES.AlertRepository)
    private alertRepository: IAlertRepository
  ) {}

  async execute(alertId: string, hardDelete?: boolean): Promise<void> {
    return this.alertRepository.deleteAlert(alertId, hardDelete);
  }
}
